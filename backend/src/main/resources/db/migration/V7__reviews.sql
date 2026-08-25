CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products (id),
    user_id UUID NOT NULL REFERENCES users (id),
    rating INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    comment TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    UNIQUE (user_id, product_id)
);

CREATE INDEX idx_reviews_product_id ON reviews (product_id, status);
