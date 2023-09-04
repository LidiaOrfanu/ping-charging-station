# ping-charging-station

## Client deployment using Vercel: <https://ping-charging-station.vercel.app>

## Server deployment using Shuttle: <https://ping-charging-station.shuttleapp.rs/api/stations>

## Database hosting on Supabase

POST station endpoint: <https://ping-charging-station.shuttleapp.rs/api/station>
example Json Body:
{
 "name": "StationX",
 "location_id": 1,
 "availability": false
}
Headers:
Content-Type: application/json

Response:
{
 "data": {
  "station": {
   "availability": false,
   "id": 3,
   "location_id": 1,
   "name": "StationX"
  }
 },
 "status": "success"
}

POST location endpoint: <https://ping-charging-station.shuttleapp.rs/api/location>
example Json Body:
{
  "street": "Penguins Land",
  "zip": 1232,
  "city": "NoCity",
  "country": "Antarctica"
}
Headers:
Content-Type: application/json

Response:
{
 "data": {
  "location": {
   "city": "NoCity",
   "country": "Antarctica",
   "id": 2,
   "street": "Penguins Land",
   "zip": 1232
  }
 },
 "status": "success"
}

Patch station sample
Request Json Body
{
    "name": "NewName",
    "availability": true/false
}

Response:
{
 "id": 11,
 "name": "RoyalPEnguinos",
 "location_id": 2,
 "availability": true
}

sqlx migrate add 'name of migrations'
sqlx migrate run --database-url "conn-url"
psql "connection_url"
DEALLOCATE ALL; for issues with migrations statements
\q to quit

Example how to run migrations:
sqlx migrate add create_stations
Creating migrations/20230904122550_create_stations.sql
Add migration script in the newly created file
sqlx migrate run --database-url "conn-url"
Applied 20230904122550/migrate create stations (126.488125ms)
revert --database-url "conn-url" --version 20230904122550
