-- Add migration script here
CREATE TABLE locations (
    id  SERIAL PRIMARY KEY,
    street varchar(255) NOT NULL,
    zip integer NOT NULL,
    city varchar(255) NOT NULL,
    country varchar(255) NOT NULL
);