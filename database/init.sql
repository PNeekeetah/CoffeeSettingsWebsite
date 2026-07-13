CREATE TABLE IF NOT EXISTS "tExtractions" (
    id SERIAL PRIMARY KEY,
    coffee_name VARCHAR(255) NOT NULL,
    grinder_setting NUMERIC(4,2),
    water_temperature_celsius NUMERIC(4,2),
    yield_ml NUMERIC(5,2),
    extraction_time Numeric(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "tCoffees" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roast_level VARCHAR(255) NOT NULL
);
