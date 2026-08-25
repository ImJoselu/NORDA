package com.norda.subscription;

import com.norda.common.security.CurrentUser;
import com.norda.subscription.dto.CreateSubscriptionRequest;
import com.norda.subscription.dto.SubscriptionResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping
    public List<SubscriptionResponse> list(Authentication authentication) {
        return subscriptionService.list(CurrentUser.id(authentication));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriptionResponse create(Authentication authentication, @Valid @RequestBody CreateSubscriptionRequest request) {
        return subscriptionService.create(CurrentUser.id(authentication), request);
    }

    @PatchMapping("/{id}")
    public SubscriptionResponse update(
            Authentication authentication, @PathVariable UUID id, @Valid @RequestBody CreateSubscriptionRequest request
    ) {
        return subscriptionService.update(CurrentUser.id(authentication), id, request);
    }

    @PostMapping("/{id}/pause")
    public SubscriptionResponse pause(Authentication authentication, @PathVariable UUID id) {
        return subscriptionService.pause(CurrentUser.id(authentication), id);
    }

    @PostMapping("/{id}/resume")
    public SubscriptionResponse resume(Authentication authentication, @PathVariable UUID id) {
        return subscriptionService.resume(CurrentUser.id(authentication), id);
    }

    @PostMapping("/{id}/cancel")
    public SubscriptionResponse cancel(Authentication authentication, @PathVariable UUID id) {
        return subscriptionService.cancel(CurrentUser.id(authentication), id);
    }

    @PostMapping("/{id}/skip")
    public SubscriptionResponse skip(Authentication authentication, @PathVariable UUID id) {
        return subscriptionService.skipNext(CurrentUser.id(authentication), id);
    }
}
