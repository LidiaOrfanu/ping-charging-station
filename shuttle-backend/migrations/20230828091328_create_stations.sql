-- Add migration script here
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    availability BOOLEAN
);