CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id),
    status VARCHAR(20) NOT NULL,
    coffee_count INT NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    origin_country_id UUID REFERENCES countries (id),
    next_delivery_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);

CREATE TABLE subscription_items (
    id UUID PRIMARY KEY,
    subscription_id UUID NOT NULL REFERENCES subscriptions (id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products (id)
);

CREATE INDEX idx_subscription_items_subscription_id ON subscription_items (subscription_id);
