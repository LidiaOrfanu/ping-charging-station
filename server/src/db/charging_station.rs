use axum::{http::StatusCode, Json};
use serde_json::{json, Value};
use sqlx::{query, query_as, Pool, Postgres};

use crate::models::charging_station::{ChargingStation, UpdateChargingStation};

pub async fn get_all(
    db_pool: &Pool<Postgres>,
) -> Result<Vec<ChargingStation>, (StatusCode, Json<Value>)> {
    const SQL_QUERY: &str = "SELECT id, name, location_id, availability FROM stations";

    let stations = query_as::<_, ChargingStation>(SQL_QUERY)
        .fetch_all(db_pool)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "status": "error",
                    "message": format!("Error retrieving stations: {:?}", e)
                })),
            )
        })?;

    Ok(stations)
}

pub async fn get_by_id(
    db_pool: &Pool<Postgres>,
    station_id: i32,
) -> Result<ChargingStation, (StatusCode, Json<Value>)> {
    const SQL_QUERY: &str = "SELECT * FROM stations WHERE id = $1";

    let station = query_as::<_, ChargingStation>(SQL_QUERY)
        .bind(station_id)
        .fetch_one(db_pool)
        .await
        .map_err(|_e| {
            (
                StatusCode::BAD_REQUEST,
                Json(json!({
                    "status": "error",
                    "message": format!("Station with ID: {} not found", station_id)
                })),
            )
        })?;

    Ok(station)
}

pub async fn check_station_name_existence(
    db_pool: &Pool<Postgres>,
    name: String,
) -> Result<bool, (StatusCode, Json<Value>)> {
    const SQL_QUERY: &str = "SELECT * FROM stations WHERE name = $1";
    let station_exists = query_as::<_, ChargingStation>(SQL_QUERY)
        .bind(name)
        .fetch_optional(db_pool)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "status": "error",
                    "message": format!("Database error: {:?}", e)
                })),
            )
        })
        .unwrap();

    Ok(station_exists.is_some())
}

pub async fn insert_new_station(
    db_pool: &Pool<Postgres>,
    name: String,
    location_id: i32,
    availability: bool,
) -> Result<ChargingStation, sqlx::Error> {
    const SQL_QUERY: &str = "INSERT INTO stations (name, location_id, availability)
                            VALUES ($1, $2, $3)
                            RETURNING *";

    let new_station = query_as::<_, ChargingStation>(SQL_QUERY)
        .bind(name)
        .bind(location_id)
        .bind(availability)
        .fetch_one(db_pool)
        .await?;

    Ok(new_station)
}

pub async fn delete_by_id(db_pool: &Pool<Postgres>, station_id: i32) -> Result<u64, sqlx::Error> {
    let rows_affected = query("DELETE FROM stations WHERE id = $1")
        .bind(station_id)
        .execute(db_pool)
        .await?
        .rows_affected();

    Ok(rows_affected)
}

pub async fn edit_by_id(
    db_pool: &Pool<Postgres>,
    id: i32,
    body: &UpdateChargingStation,
) -> Result<ChargingStation, (StatusCode, Json<Value>)> {
    let mut existing_station = get_by_id(db_pool, id).await?;

    if let Some(new_name) = body.name.clone() {
        if !new_name.is_empty() {
            existing_station.update_name(new_name);
        }
    }

    if let Some(new_availability) = body.availability {
        existing_station.update_availability(new_availability);
    }

    const UPDATE_SQL_QUERY: &str =
        "UPDATE stations SET name = $1, availability = $2 WHERE id = $3 RETURNING *";
    let updated_station: ChargingStation = query_as::<_, ChargingStation>(UPDATE_SQL_QUERY)
        .bind(existing_station.name)
        .bind(existing_station.availability)
        .bind(id)
        .fetch_one(db_pool)
        .await
        .unwrap();

    Ok(updated_station)
}
