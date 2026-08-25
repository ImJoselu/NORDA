package com.norda.admin;

import com.norda.inventory.InventoryRepository;
import com.norda.order.Order;
import com.norda.order.OrderItem;
import com.norda.order.OrderRepository;
import com.norda.order.OrderStatus;
import com.norda.order.ShippingAddress;
import com.norda.product.Grind;
import com.norda.shipping.ShippingMethod;
import com.norda.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminOrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    private AdminOrderService service() {
        return new AdminOrderService(orderRepository, userRepository, inventoryRepository);
    }

    private Order paidOrderWithOneItem(UUID variantId, int quantity) {
        Order order = new Order(
                UUID.randomUUID(), "NORDA-TEST-0001",
                new ShippingAddress("Ana Diaz", "Calle Mayor 10", null, "Madrid", "Madrid", "28013", "España", "600123456"),
                ShippingMethod.STANDARD, 2000, 500, 0, 300, 2800, null
        );
        order.addItem(new OrderItem(variantId, "Café de prueba", 250, Grind.WHOLE_BEAN, 2000, quantity));
        order.markPaid();
        return order;
    }

    @Test
    void cancellingAPaidOrderRestocksItsItems() {
        UUID orderId = UUID.randomUUID();
        UUID variantId = UUID.randomUUID();
        Order order = paidOrderWithOneItem(variantId, 2);
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        service().updateStatus(orderId, OrderStatus.CANCELLED);

        verify(inventoryRepository).restock(variantId, 2);
        assertThat(order.getStatus()).isEqualTo(OrderStatus.CANCELLED);
    }

    @Test
    void cancellingAPendingOrderDoesNotRestock() {
        UUID orderId = UUID.randomUUID();
        Order order = new Order(
                UUID.randomUUID(), "NORDA-TEST-0002",
                new ShippingAddress("Ana Diaz", "Calle Mayor 10", null, "Madrid", "Madrid", "28013", "España", "600123456"),
                ShippingMethod.STANDARD, 2000, 500, 0, 300, 2800, null
        );
        order.addItem(new OrderItem(UUID.randomUUID(), "Café de prueba", 250, Grind.WHOLE_BEAN, 2000, 1));
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        service().updateStatus(orderId, OrderStatus.CANCELLED);

        verify(inventoryRepository, never()).restock(any(), anyInt());
        assertThat(order.getStatus()).isEqualTo(OrderStatus.CANCELLED);
    }

    @Test
    void invalidTransitionIsRejectedWithoutTouchingInventory() {
        UUID orderId = UUID.randomUUID();
        Order order = paidOrderWithOneItem(UUID.randomUUID(), 1);
        order.updateStatus(OrderStatus.CANCELLED);
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> service().updateStatus(orderId, OrderStatus.SHIPPED))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("No se puede pasar de");

        verify(inventoryRepository, never()).restock(any(), anyInt());
    }

    @Test
    void unknownOrderIdReturnsNotFound() {
        UUID orderId = UUID.randomUUID();
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service().updateStatus(orderId, OrderStatus.PAID))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("no encontrado");
    }
}
