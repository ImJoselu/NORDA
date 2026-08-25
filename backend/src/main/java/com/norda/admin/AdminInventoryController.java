package com.norda.admin;

import com.norda.admin.dto.AdjustInventoryRequest;
import com.norda.admin.dto.AdminInventoryResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/inventory")
public class AdminInventoryController {

    private final AdminInventoryService adminInventoryService;

    public AdminInventoryController(AdminInventoryService adminInventoryService) {
        this.adminInventoryService = adminInventoryService;
    }

    @GetMapping
    public List<AdminInventoryResponse> list(@RequestParam(defaultValue = "false") boolean lowStockOnly) {
        return adminInventoryService.list(lowStockOnly);
    }

    @PutMapping("/{variantId}")
    public AdminInventoryResponse adjust(@PathVariable UUID variantId, @Valid @RequestBody AdjustInventoryRequest request) {
        return adminInventoryService.adjust(variantId, request.stock(), request.minStock());
    }
}
