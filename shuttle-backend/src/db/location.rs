use axum::{http::StatusCode, Json};
use serde_json::{json, Value};
use sqlx::{query_as, Pool, Postgres};

use crate::models::location::Location;

pub async fn get_all(db_pool: Pool<Postgres>) -> Result<Vec<Location>, sqlx::Error> {
    const QUERY: &str = "SELECT id, name, location_id, availability FROM stations";
    query_as::<_, Location>(QUERY).fetch_all(&db_pool).await

    // locations
}

pub async fn get_by_id(
    db_pool: &Pool<Postgres>,
    location_id: i32,
) -> Result<Location, (StatusCode, Json<Value>)> {
    const SQL_QUERY: &str = "SELECT * FROM locations WHERE id = $1";

    let location = query_as::<_, Location>(SQL_QUERY)
        .bind(location_id)
        .fetch_one(db_pool)
        .await
        .map_err(|_e| {
            (
                StatusCode::BAD_REQUEST,
                Json(json!({
                    "status": "error",
                    "message": format!("Location with ID: {} not found", location_id)
                })),
            )
        })?;

    Ok(location)
}
