-- Add migration script here
create table if not exists locations (
  id bigint primary key,
  street TEXT NOT NULL,
  zip smallint NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL
);
