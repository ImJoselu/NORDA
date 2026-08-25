package com.norda.order;

import com.norda.shipping.ShippingMethod;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * La direccion de envio se guarda desnormalizada (snapshot) en el propio pedido:
 * si el usuario edita o borra una direccion guardada despues, el historial de
 * pedidos no debe cambiar retroactivamente.
 */
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "shipping_full_name", nullable = false)
    private String shippingFullName;

    @Column(name = "shipping_line1", nullable = false)
    private String shippingLine1;

    @Column(name = "shipping_line2")
    private String shippingLine2;

    @Column(name = "shipping_city", nullable = false)
    private String shippingCity;

    @Column(name = "shipping_region", nullable = false)
    private String shippingRegion;

    @Column(name = "shipping_postal_code", nullable = false)
    private String shippingPostalCode;

    @Column(name = "shipping_country", nullable = false)
    private String shippingCountry;

    @Column(name = "shipping_phone", nullable = false)
    private String shippingPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_method", nullable = false)
    private ShippingMethod shippingMethod;

    @Column(name = "subtotal_cents", nullable = false)
    private long subtotalCents;

    @Column(name = "shipping_cents", nullable = false)
    private long shippingCents;

    @Column(name = "discount_cents", nullable = false)
    private long discountCents;

    @Column(name = "tax_cents", nullable = false)
    private long taxCents;

    @Column(name = "total_cents", nullable = false)
    private long totalCents;

    @Column(name = "coupon_code")
    private String couponCode;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("position ASC")
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Order() {
        // JPA
    }

    public Order(
            UUID userId, String orderNumber, ShippingAddress shippingAddress, ShippingMethod shippingMethod,
            long subtotalCents, long shippingCents, long discountCents, long taxCents, long totalCents,
            String couponCode
    ) {
        this.userId = userId;
        this.orderNumber = orderNumber;
        this.status = OrderStatus.PENDING;
        this.shippingFullName = shippingAddress.fullName();
        this.shippingLine1 = shippingAddress.line1();
        this.shippingLine2 = shippingAddress.line2();
        this.shippingCity = shippingAddress.city();
        this.shippingRegion = shippingAddress.region();
        this.shippingPostalCode = shippingAddress.postalCode();
        this.shippingCountry = shippingAddress.country();
        this.shippingPhone = shippingAddress.phone();
        this.shippingMethod = shippingMethod;
        this.subtotalCents = subtotalCents;
        this.shippingCents = shippingCents;
        this.discountCents = discountCents;
        this.taxCents = taxCents;
        this.totalCents = totalCents;
        this.couponCode = couponCode;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public void addItem(OrderItem item) {
        item.assignOrder(this, items.size());
        items.add(item);
    }

    public void markPaid() {
        this.status = OrderStatus.PAID;
    }

    public void markCancelled() {
        this.status = OrderStatus.CANCELLED;
    }

    public void updateStatus(OrderStatus newStatus) {
        this.status = newStatus;
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public String getShippingFullName() {
        return shippingFullName;
    }

    public String getShippingLine1() {
        return shippingLine1;
    }

    public String getShippingLine2() {
        return shippingLine2;
    }

    public String getShippingCity() {
        return shippingCity;
    }

    public String getShippingRegion() {
        return shippingRegion;
    }

    public String getShippingPostalCode() {
        return shippingPostalCode;
    }

    public String getShippingCountry() {
        return shippingCountry;
    }

    public String getShippingPhone() {
        return shippingPhone;
    }

    public ShippingMethod getShippingMethod() {
        return shippingMethod;
    }

    public long getSubtotalCents() {
        return subtotalCents;
    }

    public long getShippingCents() {
        return shippingCents;
    }

    public long getDiscountCents() {
        return discountCents;
    }

    public long getTaxCents() {
        return taxCents;
    }

    public long getTotalCents() {
        return totalCents;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
