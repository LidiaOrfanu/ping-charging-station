use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use sqlx::{query, query_as};
use std::sync::Arc;
use validator::Validate;
// use validator::Validate;

use crate::models;
use crate::{models::location::CreateLocation, AppState};

pub async fn handler_get_all_locations(
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    const SQL_QUERY: &str = "SELECT id, street, zip, city, country FROM locations";
    let existing_locations = query_as::<_, models::location::Location>(SQL_QUERY)
        .fetch_all(&data.db)
        .await;

    match existing_locations {
        Ok(locations) => Ok((StatusCode::OK, Json(locations))),
        Err(e) => {
            let error_response = json!({
                "status": "error",
                "message": format!("Error retrieving locations: {:?}", e)
            });
            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)))
        }
    }
}

pub async fn handler_get_location_by_id(
    Path(id): Path<i32>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let sql_query = format!("SELECT * FROM locations WHERE id = $1",);
    let existing_location = query_as::<_, models::location::Location>(&sql_query)
        .bind(id)
        .fetch_one(&data.db)
        .await;

    match existing_location {
        Ok(location) => {
            let location_response = json!({
                "status": "success",
                "data": json!({
                    "location": location
                })
            });

            return Ok((StatusCode::FOUND, Json(location_response)));
        }
        Err(_) => {
            let error_response = json!({
                "status": "fail",
                "message": format!("Location with ID: {} not found", id)
            });

            return Err((StatusCode::NOT_FOUND, Json(error_response)));
        }
    }
}

pub async fn handler_post_a_location(
    State(data): State<Arc<AppState>>,
    Json(body): Json<CreateLocation>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    if let Err(_validation_err) = body.validate() {
        let validation_error = json!({
            "status": "error",
            "message": "Length problem".to_string()
        });
        return Err((StatusCode::BAD_REQUEST, Json(validation_error)));
    }

    let sql_query = format!(
        "INSERT INTO locations (street, zip, city, country) VALUES ('{}', {}, '{}', '{}') RETURNING *",
        body.street, body.zip, body.city, body.country
    );

    let existing_location = query_as::<_, models::location::Location>(&sql_query)
        .fetch_one(&data.db)
        .await;

    match existing_location {
        Ok(location) => {
            let location_response = json!({
                "status": "success",
                "data": {
                    "location": {
                        "id": location.id,
                        "street": location.street,
                        "zip": location.zip,
                        "city": location.city,
                        "country": location.country,
                    }
                }
            });
            return Ok((StatusCode::CREATED, Json(location_response)));
        }
        Err(e) => {
            if e.to_string()
                .contains("duplicate key value violates unique constraint")
            {
                let error_response = json!({
                    "status": "fail",
                    "message": "Location with that street already exists",
                });
                return Err((StatusCode::CONFLICT, Json(error_response)));
            }
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"status": "error","message": format!("{:?}", e)})),
            ));
        }
    }
}

pub async fn handler_delete_location_by_id(
    Path(id): Path<String>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let id = id.trim().parse::<i32>().unwrap();
    let rows_affected = query("DELETE FROM locations WHERE id = $1")
        .bind(id)
        .execute(&data.db)
        .await
        .unwrap()
        .rows_affected();

    if rows_affected == 0 {
        let error_response = json!({
            "status": "fail",
            "message": format!("Location with ID: {} not found", id)
        });

        return Err((StatusCode::NOT_FOUND, Json(error_response)));
    }

    Ok(StatusCode::NO_CONTENT)
}
