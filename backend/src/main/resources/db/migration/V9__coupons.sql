ALTER TABLE carts ADD COLUMN coupon_code VARCHAR(40);

CREATE TABLE coupons (
    id UUID PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    value BIGINT NOT NULL,
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    min_purchase_cents BIGINT,
    max_uses INT,
    used_count INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE coupon_usages (
    id UUID PRIMARY KEY,
    coupon_id UUID NOT NULL REFERENCES coupons (id),
    user_id UUID NOT NULL REFERENCES users (id),
    order_id UUID REFERENCES orders (id),
    used_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_coupon_usages_coupon_user ON coupon_usages (coupon_id, user_id);

INSERT INTO coupons (id, code, type, value, min_purchase_cents, max_uses, active, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'NORDA10', 'PERCENTAGE', 10, NULL, NULL, true, now(), now()),
    (gen_random_uuid(), 'WELCOME15', 'PERCENTAGE', 15, 2000, 500, true, now(), now());
