-- Add migration script here
ALTER TABLE stations
DROP CONSTRAINT IF EXISTS stations_location_id_fkey,
ADD CONSTRAINT stations_location_id_fkey FOREIGN KEY (location_id)
REFERENCES locations(id) ON DELETE SET NULL;