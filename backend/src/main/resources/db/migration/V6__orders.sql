CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id),
    order_number VARCHAR(40) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL,
    shipping_full_name VARCHAR(150) NOT NULL,
    shipping_line1 VARCHAR(200) NOT NULL,
    shipping_line2 VARCHAR(200),
    shipping_city VARCHAR(100) NOT NULL,
    shipping_region VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(30) NOT NULL,
    shipping_method VARCHAR(20) NOT NULL,
    subtotal_cents BIGINT NOT NULL,
    shipping_cents BIGINT NOT NULL,
    discount_cents BIGINT NOT NULL,
    tax_cents BIGINT NOT NULL,
    total_cents BIGINT NOT NULL,
    coupon_code VARCHAR(40),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);

CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    position INT NOT NULL,
    product_variant_id UUID NOT NULL REFERENCES product_variants (id),
    product_name VARCHAR(200) NOT NULL,
    weight_grams INT NOT NULL,
    grind VARCHAR(20) NOT NULL,
    unit_price_cents BIGINT NOT NULL,
    quantity INT NOT NULL,
    line_total_cents BIGINT NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);

CREATE TABLE payments (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL UNIQUE REFERENCES orders (id),
    provider VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    external_reference VARCHAR(120),
    amount_cents BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
