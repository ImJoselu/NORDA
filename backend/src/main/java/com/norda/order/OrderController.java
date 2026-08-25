package com.norda.order;

import com.norda.cart.dto.CartResponse;
import com.norda.common.security.CurrentUser;
import com.norda.order.dto.CheckoutRequest;
import com.norda.order.dto.OrderResponse;
import com.norda.order.dto.OrderSummaryResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/api/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(Authentication authentication, @Valid @RequestBody CheckoutRequest request) {
        return orderService.checkout(CurrentUser.id(authentication), request);
    }

    @GetMapping("/api/orders")
    public List<OrderSummaryResponse> list(Authentication authentication) {
        return orderService.list(CurrentUser.id(authentication));
    }

    @GetMapping("/api/orders/{orderId}")
    public OrderResponse get(Authentication authentication, @PathVariable UUID orderId) {
        return orderService.get(CurrentUser.id(authentication), orderId);
    }

    @PostMapping("/api/orders/{orderId}/reorder")
    public CartResponse reorder(Authentication authentication, @PathVariable UUID orderId) {
        return orderService.reorder(CurrentUser.id(authentication), orderId);
    }
}
