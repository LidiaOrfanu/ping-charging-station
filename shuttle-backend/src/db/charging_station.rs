use axum::{http::StatusCode, Json};
use serde_json::{json, Value};
use sqlx::{query_as, Pool, Postgres};

use crate::models::charging_station::ChargingStation;

pub async fn get_all(db_pool: Pool<Postgres>) -> Result<Vec<ChargingStation>, sqlx::Error> {
    const SQL_QUERY: &str = "SELECT id, name, location_id, availability FROM stations";
    query_as::<_, ChargingStation>(SQL_QUERY)
        .fetch_all(&db_pool)
        .await
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
                            VALUES ($1, $2, $3))
                            RETURNING *";

    let new_station = query_as::<_, ChargingStation>(SQL_QUERY)
        .bind(name)
        .bind(location_id)
        .bind(availability)
        .fetch_one(db_pool)
        .await?;

    Ok(new_station)
}
