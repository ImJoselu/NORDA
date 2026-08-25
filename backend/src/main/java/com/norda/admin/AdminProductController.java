package com.norda.admin;

import com.norda.admin.dto.AdminProductDetailResponse;
import com.norda.admin.dto.AdminProductRequest;
import com.norda.product.dto.ProductSummaryResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping
    public List<ProductSummaryResponse> list() {
        return adminProductService.list();
    }

    @GetMapping("/{id}")
    public AdminProductDetailResponse get(@PathVariable UUID id) {
        return adminProductService.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductSummaryResponse create(@Valid @RequestBody AdminProductRequest request) {
        return adminProductService.create(request);
    }

    @PutMapping("/{id}")
    public ProductSummaryResponse update(@PathVariable UUID id, @Valid @RequestBody AdminProductRequest request) {
        return adminProductService.update(id, request);
    }

    @PostMapping("/{id}/archive")
    public ProductSummaryResponse archive(@PathVariable UUID id) {
        return adminProductService.archive(id);
    }

    @PostMapping("/{id}/activate")
    public ProductSummaryResponse activate(@PathVariable UUID id) {
        return adminProductService.activate(id);
    }
}
