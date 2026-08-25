package com.norda.order;

import com.norda.order.dto.OrderItemResponse;
import com.norda.order.dto.OrderResponse;
import com.norda.order.dto.OrderSummaryResponse;

public final class OrderMapper {

    private OrderMapper() {
    }

    public static OrderResponse toResponse(Order order) {
        ShippingAddress address = new ShippingAddress(
                order.getShippingFullName(), order.getShippingLine1(), order.getShippingLine2(),
                order.getShippingCity(), order.getShippingRegion(), order.getShippingPostalCode(),
                order.getShippingCountry(), order.getShippingPhone()
        );

        return new OrderResponse(
                order.getId(), order.getOrderNumber(), order.getStatus(), address, order.getShippingMethod(),
                order.getSubtotalCents(), order.getShippingCents(), order.getDiscountCents(), order.getTaxCents(),
                order.getTotalCents(),
                order.getItems().stream().map(OrderMapper::toItemResponse).toList(),
                order.getCreatedAt()
        );
    }

    public static OrderItemResponse toItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getProductVariantId(), item.getProductName(), item.getWeightGrams(), item.getGrind(),
                item.getUnitPriceCents(), item.getQuantity(), item.getLineTotalCents()
        );
    }

    public static OrderSummaryResponse toSummary(Order order) {
        int itemCount = order.getItems().stream().mapToInt(OrderItem::getQuantity).sum();
        return new OrderSummaryResponse(
                order.getId(), order.getOrderNumber(), order.getStatus(), order.getTotalCents(), itemCount, order.getCreatedAt()
        );
    }
}
