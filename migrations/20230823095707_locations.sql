-- Add migration script here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS locations (
  id uuid DEFAULT uuid_generate_v1() NOT NULL CONSTRAINT location_pkey PRIMARY KEY,
  street TEXT NOT NULL,
  zip smallint NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL
);
