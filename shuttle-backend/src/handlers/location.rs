use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use std::sync::Arc;
use validator::Validate;
// use validator::Validate;

use crate::{
    db::location::{get_all, insert_new_location},
    models::location::UpdateLocation,
};
use crate::{models::location::CreateLocation, AppState};

pub async fn handler_get_all_locations(
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    match get_all(&data.db).await {
        Ok(locations) => Ok((StatusCode::OK, Json(locations))),
        Err((status_code, error_response)) => Err((status_code, error_response)),
    }
}

pub async fn handler_get_location_by_id(
    Path(id): Path<i32>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    match crate::db::location::get_by_id(&data.db, id).await {
        Ok(location) => Ok((StatusCode::FOUND, Json(location))),
        Err((status_code, error_response)) => Err((status_code, error_response)),
    }
}

pub async fn handler_post_a_location(
    State(data): State<Arc<AppState>>,
    Json(body): Json<CreateLocation>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    if let Err(_valid_e) = body.validate() {
        let error_response = json!({
            "status": "error",
            "message": "Length problem".to_string()
        });
        return Err((StatusCode::BAD_REQUEST, Json(error_response)));
    }

    match insert_new_location(&data.db, body).await {
        Ok(location) => Ok((StatusCode::CREATED, Json(location))),
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
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"status": "error","message": format!("{:?}", e)})),
            ))
        }
    }
}

pub async fn handler_delete_location_by_id(
    Path(id): Path<String>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let id = id.trim().parse::<i32>().unwrap();

    match crate::db::location::delete_by_id(&data.db, id).await {
        Ok(rows_affected) => {
            if rows_affected == 0 {
                let error_response = json!({
                    "status": "fail",
                    "message": format!("Location with ID: {} not found", id)
                });

                return Err((StatusCode::NOT_FOUND, Json(error_response)));
            }

            Ok(StatusCode::NO_CONTENT)
        }
        Err(_) => {
            let error_response = json!({
                "status": "error",
                "message": "Failed to delete location"
            });

            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)))
        }
    }
}

pub async fn handler_edit_location_by_id(
    Path(id): Path<i32>,
    State(data): State<Arc<AppState>>,
    Json(body): Json<UpdateLocation>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    match crate::db::location::edit_by_id(&data.db, id, &body).await {
        Ok(updated_station) => Ok((StatusCode::OK, Json(updated_station))),
        Err((status_code, error_response)) => Err((status_code, error_response)),
    }
}
