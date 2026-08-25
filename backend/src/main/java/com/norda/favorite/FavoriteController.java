package com.norda.favorite;

import com.norda.common.security.CurrentUser;
import com.norda.product.dto.ProductSummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public List<ProductSummaryResponse> list(Authentication authentication) {
        return favoriteService.list(CurrentUser.id(authentication));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> add(Authentication authentication, @PathVariable UUID productId) {
        favoriteService.add(CurrentUser.id(authentication), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> remove(Authentication authentication, @PathVariable UUID productId) {
        favoriteService.remove(CurrentUser.id(authentication), productId);
        return ResponseEntity.noContent().build();
    }
}
