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
