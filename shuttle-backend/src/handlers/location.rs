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

use crate::{models::{self, location::{Location, UpdateLocation}}, db::location::get_all};
use crate::{models::location::CreateLocation, AppState};

pub async fn handler_get_all_locations(
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {

    let db_clone = data.db.clone();
    match get_all(db_clone).await {
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

pub async fn handler_edit_location_by_id(
    Path(id): Path<i32>,
    State(data): State<Arc<AppState>>,
    Json(body): Json<UpdateLocation>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let sql_query = "SELECT * FROM locations WHERE id = $1";
    let existing_location = query_as::<_, Location>(sql_query)
        .bind(id)
        .fetch_optional(&data.db)
        .await;

    if let Some(mut location) = existing_location.unwrap() {
            if let Some(new_street) = body.street {
                if !new_street.is_empty() {
                    location.street = new_street.clone();
                }
            }

            if let Some(new_zip) = body.zip {
                if new_zip != 0 {
                    location.zip = new_zip;
                }
            }
            
            if let Some(new_city) = body.city {
                if !new_city.is_empty() {
                    location.city = new_city.clone();
                }
            }
            if let Some(new_country) = body.country {
                if !new_country.is_empty() {
                    location.country = new_country.clone();
                }
            }
        let update_sql_query =
            "UPDATE locations SET street = $1, zip = $2, city=$3, country=$4 WHERE id = $5 RETURNING *";
        let updated_station: Result<Location, _> =
            query_as::<_, Location>(update_sql_query)
                .bind(location.street)
                .bind(location.zip)
                .bind(location.city)
                .bind(location.country)
                .bind(id)
                .fetch_one(&data.db)
                .await;

        match updated_station {
            Ok(updated) => {
                return Ok((StatusCode::OK, Json(updated)));
            }
            Err(err) => {
                let error_response = json!({
                    "status": "error",
                    "message": format!("{:?}", err)
                });
                return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)));
            }
        }
    } else {
        let error_response = json!({
            "status": "fail",
            "message": format!("Station with ID: {} not found", id)
        });
        return Err((StatusCode::NOT_FOUND, Json(error_response)));
    }
}