package com.norda.admin;

import com.norda.admin.dto.AdminReviewResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/reviews")
public class AdminReviewController {

    private final AdminReviewService adminReviewService;

    public AdminReviewController(AdminReviewService adminReviewService) {
        this.adminReviewService = adminReviewService;
    }

    @GetMapping
    public List<AdminReviewResponse> list() {
        return adminReviewService.list();
    }

    @PostMapping("/{id}/hide")
    public void hide(@PathVariable UUID id) {
        adminReviewService.hide(id);
    }

    @PostMapping("/{id}/restore")
    public void restore(@PathVariable UUID id) {
        adminReviewService.restore(id);
    }
}
