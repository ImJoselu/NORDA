package com.norda.admin;

import com.norda.admin.dto.AdminOrderResponse;
import com.norda.inventory.InventoryRepository;
import com.norda.order.Order;
import com.norda.order.OrderItem;
import com.norda.order.OrderMapper;
import com.norda.order.OrderRepository;
import com.norda.order.OrderStatus;
import com.norda.order.dto.OrderResponse;
import com.norda.user.User;
import com.norda.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminOrderService {

    private static final Set<OrderStatus> STOCK_ALREADY_DEDUCTED =
            EnumSet.of(OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED);
    private static final Set<OrderStatus> RESTOCKING_TARGETS = EnumSet.of(OrderStatus.CANCELLED, OrderStatus.REFUNDED);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;

    public AdminOrderService(OrderRepository orderRepository, UserRepository userRepository, InventoryRepository inventoryRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> list(OrderStatus status) {
        List<Order> orders = status == null
                ? orderRepository.findAllByOrderByCreatedAtDesc()
                : orderRepository.findAllByStatusOrderByCreatedAtDesc(status);

        Map<UUID, User> usersById = userRepository.findAllById(orders.stream().map(Order::getUserId).distinct().toList())
                .stream().collect(Collectors.toMap(User::getId, u -> u));

        return orders.stream().map(order -> toAdminResponse(order, usersById.get(order.getUserId()))).toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse get(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));
        return OrderMapper.toResponse(order);
    }

    public OrderResponse updateStatus(UUID orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado."));

        if (!order.getStatus().canTransitionTo(newStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede pasar de " + order.getStatus() + " a " + newStatus + "."
            );
        }

        if (STOCK_ALREADY_DEDUCTED.contains(order.getStatus()) && RESTOCKING_TARGETS.contains(newStatus)) {
            for (OrderItem item : order.getItems()) {
                inventoryRepository.restock(item.getProductVariantId(), item.getQuantity());
            }
        }

        order.updateStatus(newStatus);
        return OrderMapper.toResponse(order);
    }

    private AdminOrderResponse toAdminResponse(Order order, User user) {
        int itemCount = order.getItems().stream().mapToInt(OrderItem::getQuantity).sum();
        return new AdminOrderResponse(
                order.getId(), order.getOrderNumber(), order.getStatus(),
                user != null ? user.getFirstName() + " " + user.getLastName() : "—",
                user != null ? user.getEmail() : "—",
                order.getTotalCents(), itemCount, order.getCreatedAt()
        );
    }
}
