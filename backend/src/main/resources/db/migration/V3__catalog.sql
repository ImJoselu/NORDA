CREATE TABLE countries (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    continent VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    typical_altitude_min_m INT NOT NULL,
    typical_altitude_max_m INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE regions (
    id UUID PRIMARY KEY,
    country_id UUID NOT NULL REFERENCES countries (id),
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_regions_country_id ON regions (country_id);

CREATE TABLE producers (
    id UUID PRIMARY KEY,
    region_id UUID NOT NULL REFERENCES regions (id),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_producers_region_id ON producers (region_id);

CREATE TABLE farms (
    id UUID PRIMARY KEY,
    producer_id UUID NOT NULL REFERENCES producers (id),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    altitude_m INT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_farms_producer_id ON farms (producer_id);

CREATE TABLE coffee_lots (
    id UUID PRIMARY KEY,
    farm_id UUID NOT NULL REFERENCES farms (id),
    code VARCHAR(60) NOT NULL UNIQUE,
    harvest_date DATE NOT NULL,
    roast_date DATE NOT NULL,
    quantity_kg INT NOT NULL,
    supplier VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_coffee_lots_farm_id ON coffee_lots (farm_id);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    sku VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    country_id UUID NOT NULL REFERENCES countries (id),
    region_id UUID NOT NULL REFERENCES regions (id),
    producer_id UUID NOT NULL REFERENCES producers (id),
    farm_id UUID NOT NULL REFERENCES farms (id),
    current_lot_id UUID REFERENCES coffee_lots (id),
    variety VARCHAR(120) NOT NULL,
    process VARCHAR(20) NOT NULL,
    altitude_m INT NOT NULL,
    roast_level VARCHAR(20) NOT NULL,
    acidity INT NOT NULL,
    body INT NOT NULL,
    sweetness INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    base_price_cents BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_products_country_id ON products (country_id);
CREATE INDEX idx_products_region_id ON products (region_id);
CREATE INDEX idx_products_producer_id ON products (producer_id);
CREATE INDEX idx_products_status ON products (status);

CREATE TABLE product_tasting_notes (
    product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    position INT NOT NULL,
    note VARCHAR(80) NOT NULL,
    PRIMARY KEY (product_id, position)
);

CREATE TABLE product_recommended_methods (
    product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    method VARCHAR(20) NOT NULL,
    PRIMARY KEY (product_id, method)
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products (id),
    sku VARCHAR(60) NOT NULL UNIQUE,
    weight_grams INT NOT NULL,
    grind VARCHAR(20) NOT NULL,
    price_cents BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_product_variants_product_id ON product_variants (product_id);

CREATE TABLE inventory (
    product_variant_id UUID PRIMARY KEY REFERENCES product_variants (id),
    stock INT NOT NULL,
    reserved INT NOT NULL,
    min_stock INT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
