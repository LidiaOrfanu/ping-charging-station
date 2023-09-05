# ping-charging-station

Project scope: Charging Station Management System (MVP)

## Overview

Ping-charging-station is a full-stack application that allows users to manage and monitor EV charging stations at various locations.
It provides essential functionalities for administrators: add, edit, and delete charging stations and their associated locations.

## Technologies

- Rust with the Axum framework for handling HTTP requests
- PostgreSQL for storing station and location data, with SQLx library for database interactions
- React with Vite and Typescript for building the UI
- Formik for the forms
- Shuttle Secrets to store the environment variable (database connection string)

## Client deployment using Vercel: <https://ping-charging-station.vercel.app>

## Server deployment using Shuttle: <https://ping-charging-station.shuttleapp.rs/api/stations>

## Database hosting on Supabase (PostgreSQL)

## Setup

Charging Stations table:

- station name
- status(availability)
- location id

Locations table:

- street
- zip
- city
- country

This setup establishes a relationship between stations and locations, where each station can be associated with a location, and if a location is deleted, the association is set to NULL in the stations table to maintain referential integrity.

## Endpoints

GET all locations: <https://ping-charging-station.shuttleapp.rs/api/locations>
GET all stations: <https://ping-charging-station.shuttleapp.rs/api/stations>

GET, DELETE, PATCH location by id: <https://ping-charging-station.shuttleapp.rs/api/location/2>
GET, DELETE, PATCH station by id: <https://ping-charging-station.shuttleapp.rs/api/station/2>

POST station: <https://ping-charging-station.shuttleapp.rs/api/station>
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

POST location: <https://ping-charging-station.shuttleapp.rs/api/location>
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

PATCH station: <https://ping-charging-station.shuttleapp.rs/api/station/3>
Can update only availability/only name or both

Request Json Body
{
    "availability": false,
    "name":"Ping-X"
}

Request Json Body
{
    "availability": true,
    "name":""
}

Response:
{
    "id": 3,
    "name": "Ping-X",
    "location_id": 10,
    "availability": true
}

PATCH location example: <https://ping-charging-station.shuttleapp.rs/api/location/2>  
Can update either all the fields or optional ones: only street/zip/city/country  
Request:  
{  
    "street": "Lustgårdsgatan 19",  
    "zip": 11251,  
    "city": "Stockholm",  
    "country": "Sweden"  
}  

Response:  
{  
    "id": 2,  
    "street": "Lustgårdsgatan 19",  
    "zip": 11251,  
    "city": "Stockholm",  
    "country": "Sweden"  
}  

## Notes

Example how to run migrations:  
sqlx migrate add create_stations  
-> Creating migrations/20230904122550_create_stations.sql  

Add migration script in the newly created file  
sqlx migrate run --database-url "conn-url"  
-> Applied 20230904122550/migrate create stations (126.488125ms)  

Personal useful commands:  
psql "connection_url"  
DEALLOCATE ALL; for issues with migrations statements  
\q to quit  

Most used shuttle-commands:  
cargo shuttle run: Run the project locally so you can test your changes.  
cargo shuttle project restart: Destroy and create an environment for this project on Shuttle  
cargo shuttle deploy --allow-dirty: Deploy the project to shuttle (including files not committed to git).  

Full list can be found here:  <https://docs.shuttle.rs/getting-started/shuttle-commands>  

## Fun fact

Thomas Hamilton at Guru 99 offers additional thoughts on best response time testing. He suggests 0.1 seconds(100 ms) is a recommended API response time. "Users always feel that the application or system is responding instantly and do not feel any interruption."  

Hamilton also suggests 1.0 seconds is the maximum level of good response time.  
<https://hyperping.io/blog/what-is-a-good-api-response-time>  

Tested the endpoints with Insomnia and the API response time I got: 33.9 ms, 38 ms, 43.3 ms, 39.6 ms, 175ms  
