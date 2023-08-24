-- Add migration script here
CREATE TABLE stations (
    id  SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    location varchar(255) NOT NULL,
    availability BOOLEAN
);