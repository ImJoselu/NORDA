package com.norda.admin;

import com.norda.admin.dto.AdminCustomerResponse;
import com.norda.order.Order;
import com.norda.order.OrderRepository;
import com.norda.order.OrderStatus;
import com.norda.subscription.Subscription;
import com.norda.subscription.SubscriptionRepository;
import com.norda.subscription.SubscriptionStatus;
import com.norda.user.User;
import com.norda.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/** Un pedido "cuenta" para el gasto total del cliente solo si el pago se completo. */
@Service
@Transactional(readOnly = true)
public class AdminCustomerService {

    private static final Set<OrderStatus> PAID_STATUSES =
            EnumSet.of(OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED);

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final SubscriptionRepository subscriptionRepository;

    public AdminCustomerService(UserRepository userRepository, OrderRepository orderRepository,
                                 SubscriptionRepository subscriptionRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    public List<AdminCustomerResponse> list() {
        List<User> users = userRepository.findAll();

        Map<UUID, List<Order>> ordersByUser = orderRepository.findAll().stream()
                .collect(Collectors.groupingBy(Order::getUserId));
        Set<UUID> usersWithActiveSubscription = subscriptionRepository.findAll().stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE)
                .map(Subscription::getUserId)
                .collect(Collectors.toSet());

        return users.stream()
                .map(user -> {
                    List<Order> orders = ordersByUser.getOrDefault(user.getId(), List.of());
                    List<Order> paidOrders = orders.stream().filter(o -> PAID_STATUSES.contains(o.getStatus())).toList();
                    long totalSpent = paidOrders.stream().mapToLong(Order::getTotalCents).sum();
                    var lastOrderAt = orders.stream().map(Order::getCreatedAt).max(Comparator.naturalOrder()).orElse(null);
                    return new AdminCustomerResponse(
                            user.getId(), user.getFirstName() + " " + user.getLastName(), user.getEmail(),
                            paidOrders.size(), totalSpent, lastOrderAt,
                            usersWithActiveSubscription.contains(user.getId()), user.getCreatedAt()
                    );
                })
                .sorted(Comparator.comparingLong(AdminCustomerResponse::totalSpentCents).reversed())
                .toList();
    }
}
