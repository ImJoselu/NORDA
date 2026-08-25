package com.norda.admin;

import com.norda.admin.dto.DashboardResponse;
import com.norda.inventory.Inventory;
import com.norda.inventory.InventoryRepository;
import com.norda.inventory.InventoryStatus;
import com.norda.order.Order;
import com.norda.order.OrderItem;
import com.norda.order.OrderRepository;
import com.norda.order.OrderStatus;
import com.norda.subscription.SubscriptionRepository;
import com.norda.subscription.SubscriptionStatus;
import com.norda.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/** Todo se agrega en memoria: a la escala de un portfolio (cientos de pedidos, no millones), es simple y suficientemente rapido. */
@Service
@Transactional(readOnly = true)
public class AdminDashboardService {

    private static final Set<OrderStatus> PAID_STATUSES =
            EnumSet.of(OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;
    private final SubscriptionRepository subscriptionRepository;

    public AdminDashboardService(OrderRepository orderRepository, UserRepository userRepository,
                                  InventoryRepository inventoryRepository, SubscriptionRepository subscriptionRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.inventoryRepository = inventoryRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    public DashboardResponse get() {
        List<Order> paidOrders = orderRepository.findAll().stream()
                .filter(o -> PAID_STATUSES.contains(o.getStatus()))
                .toList();

        long totalRevenue = paidOrders.stream().mapToLong(Order::getTotalCents).sum();
        long averageOrderValue = paidOrders.isEmpty() ? 0 : totalRevenue / paidOrders.size();

        int lowStockCount = (int) inventoryRepository.findAll().stream()
                .map(Inventory::getStatus)
                .filter(status -> status != InventoryStatus.IN_STOCK)
                .count();

        int activeSubscriptions = (int) subscriptionRepository.findAll().stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE)
                .count();

        int recurringCustomers = (int) paidOrders.stream()
                .collect(Collectors.groupingBy(Order::getUserId, Collectors.counting()))
                .values().stream().filter(count -> count >= 2).count();

        return new DashboardResponse(
                totalRevenue, paidOrders.size(), (int) userRepository.count(), averageOrderValue,
                lowStockCount, activeSubscriptions, recurringCustomers,
                salesLast14Days(paidOrders), topProducts(paidOrders), topCountries(paidOrders)
        );
    }

    private List<DashboardResponse.DailySales> salesLast14Days(List<Order> paidOrders) {
        DateTimeFormatter isoDate = DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDate today = LocalDate.now(ZoneOffset.UTC);

        Map<LocalDate, List<Order>> byDay = paidOrders.stream()
                .collect(Collectors.groupingBy(o -> o.getCreatedAt().atZone(ZoneOffset.UTC).toLocalDate()));

        return java.util.stream.IntStream.rangeClosed(0, 13)
                .mapToObj(offset -> today.minusDays(13 - offset))
                .map(day -> {
                    List<Order> dayOrders = byDay.getOrDefault(day, List.of());
                    long revenue = dayOrders.stream().mapToLong(Order::getTotalCents).sum();
                    return new DashboardResponse.DailySales(day.format(isoDate), revenue, dayOrders.size());
                })
                .toList();
    }

    private List<DashboardResponse.TopProduct> topProducts(List<Order> paidOrders) {
        record Agg(int units, long revenue) {
        }
        Map<String, Agg> byProduct = new java.util.HashMap<>();
        for (Order order : paidOrders) {
            for (OrderItem item : order.getItems()) {
                byProduct.merge(item.getProductName(), new Agg(item.getQuantity(), item.getLineTotalCents()),
                        (a, b) -> new Agg(a.units() + b.units(), a.revenue() + b.revenue()));
            }
        }
        return byProduct.entrySet().stream()
                .sorted(Comparator.comparingInt((Map.Entry<String, Agg> e) -> e.getValue().units()).reversed())
                .limit(5)
                .map(e -> new DashboardResponse.TopProduct(e.getKey(), e.getValue().units(), e.getValue().revenue()))
                .toList();
    }

    private List<DashboardResponse.TopCountry> topCountries(List<Order> paidOrders) {
        return paidOrders.stream()
                .collect(Collectors.groupingBy(Order::getShippingCountry, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> new DashboardResponse.TopCountry(e.getKey(), e.getValue().intValue()))
                .toList();
    }
}
