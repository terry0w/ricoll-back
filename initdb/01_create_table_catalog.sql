-- =============================================================
--  TABLA: products
--  Ajusta las restricciones (PK, FK, NOT NULL, CHECK, etc.)
--  según tus necesidades antes de ejecutar.
-- =============================================================
CREATE TABLE IF NOT EXISTS products (
    product_id        INTEGER,
    set_name          VARCHAR(50),
    name              VARCHAR(100),
    clean_name        VARCHAR(100),
    image_url         VARCHAR(100),
    category_id       INTEGER,
    group_id          INTEGER,
    url               VARCHAR(50),
    modified_on       TIMESTAMP,
    image_count       INTEGER,
    low_price         NUMERIC(10,2),
    mid_price         NUMERIC(10,2),
    high_price        NUMERIC(10,2),
    market_price      NUMERIC(10,2),
    direct_low_price  NUMERIC(10,2),
    sub_type_name     VARCHAR(20),
    ext_rarity        VARCHAR(20),
    ext_number        VARCHAR(20),
    ext_description   TEXT,
    ext_energy_cost   SMALLINT,
    ext_power_cost    SMALLINT,
    ext_might         SMALLINT,
    ext_card_type     VARCHAR(30),
    ext_tag           VARCHAR(50),
    ext_domain        VARCHAR(20),
    ext_flavor_text   TEXT
);

