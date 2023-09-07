use axum::{http::StatusCode, Json};
use serde_json::{json, Value};
use sqlx::{query, query_as, Pool, Postgres};

use crate::models::location::{CreateLocation, Location, UpdateLocation};

pub async fn get_all(db_pool: &Pool<Postgres>) -> Result<Vec<Location>, (StatusCode, Json<Value>)> {
    const QUERY: &str = "SELECT id, street, zip, city, country FROM locations";
    let locations = query_as::<_, Location>(QUERY)
        .fetch_all(db_pool)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "status": "error",
                    "message": format!("Error retrieving locations: {:?}", e)
                })),
            )
        })?;

    Ok(locations)
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

pub async fn delete_by_id(db_pool: &Pool<Postgres>, location_id: i32) -> Result<u64, sqlx::Error> {
    let rows_affected = query("DELETE FROM locations WHERE id = $1")
        .bind(location_id)
        .execute(db_pool)
        .await?
        .rows_affected();

    Ok(rows_affected)
}

pub async fn insert_new_location(
    db_pool: &Pool<Postgres>,
    body: CreateLocation,
) -> Result<Location, sqlx::Error> {
    const SQL_QUERY: &str = "INSERT INTO locations (street, zip, city, country) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *";

    let new_location = query_as::<_, Location>(SQL_QUERY)
        .bind(body.street)
        .bind(body.zip)
        .bind(body.city)
        .bind(body.country)
        .fetch_one(db_pool)
        .await?;

    Ok(new_location)
}

pub async fn edit_by_id(
    db_pool: &Pool<Postgres>,
    id: i32,
    body: &UpdateLocation,
) -> Result<Location, (StatusCode, Json<Value>)> {
    let mut existing_location = get_by_id(db_pool, id).await?;

    existing_location.update_street(body.street.clone());
    existing_location.update_zip(body.zip);
    existing_location.update_city(body.city.clone());
    existing_location.update_country(body.country.clone());

    const UPDATE_SQL_QUERY: &str =
        "UPDATE locations SET street = $1, zip = $2, city=$3, country=$4 
        WHERE id = $5 
        RETURNING *";

    let updated_location: Location = query_as::<_, Location>(UPDATE_SQL_QUERY)
        .bind(existing_location.street)
        .bind(existing_location.zip)
        .bind(existing_location.city)
        .bind(existing_location.country)
        .bind(id)
        .fetch_one(db_pool)
        .await
        .map_err(|_e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "status": "error",
                    "message": "Failed to update location here",
                })),
            )
        })?;

    Ok(updated_location)
}
