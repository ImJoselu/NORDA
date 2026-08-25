package com.norda.admin.dto;

import java.util.List;

public record DashboardResponse(
        long totalRevenueCents,
        int totalOrders,
        int totalCustomers,
        long averageOrderValueCents,
        int lowStockCount,
        int activeSubscriptions,
        int recurringCustomers,
        List<DailySales> salesLast14Days,
        List<TopProduct> topProducts,
        List<TopCountry> topCountries
) {
    public record DailySales(String date, long revenueCents, int orderCount) {
    }

    public record TopProduct(String name, int unitsSold, long revenueCents) {
    }

    public record TopCountry(String countryCode, int orderCount) {
    }
}
