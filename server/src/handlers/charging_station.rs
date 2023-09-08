use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use std::sync::Arc;
use validator::Validate;

use crate::{
    db::charging_station::{check_station_name_existence, get_all, insert_new_station},
    models::charging_station::{CreateChargingStation, UpdateChargingStation},
    AppState,
};

pub async fn handle_get_all_stations(
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    match get_all(&data.db).await {
        Ok(stations) => Ok((StatusCode::OK, Json(stations))),
        Err((status_code, error_response)) => Err((status_code, error_response)),
    }
}

pub async fn handler_get_station_by_id(
    Path(id): Path<i32>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    match crate::db::charging_station::get_by_id(&data.db, id).await {
        Ok(station) => Ok((StatusCode::FOUND, Json(station))),
        Err((status_code, error_response)) => Err((status_code, error_response)),
    }
}

pub async fn handler_delete_station_by_id(
    Path(id): Path<String>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let id = id.trim().parse::<i32>().unwrap();

    match crate::db::charging_station::delete_by_id(&data.db, id).await {
        Ok(rows_affected) => {
            if rows_affected == 0 {
                let error_response = json!({
                    "status": "fail",
                    "message": format!("Station with ID: {} not found", id)
                });

                return Err((StatusCode::NOT_FOUND, Json(error_response)));
            }

            Ok(StatusCode::NO_CONTENT)
        }
        Err(_) => {
            let error_response = json!({
                "status": "error",
                "message": "Failed to delete station"
            });

            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)))
        }
    }
}

pub async fn handle_post_a_station(
    State(data): State<Arc<AppState>>,
    Json(body): Json<CreateChargingStation>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    if let Err(_valid_e) = body.validate() {
        let error_response = json!({
            "status": "error",
            "message": "Length problem".to_string()
        });
        return Err((StatusCode::BAD_REQUEST, Json(error_response)));
    }

    if check_station_name_existence(&data.db, body.name.clone()).await? {
        let error_response = json!({
            "status": "fail",
            "message": "Station with that name already exists",
        });
        return Err((StatusCode::CONFLICT, Json(error_response)));
    }

    let location = match crate::db::location::get_by_id(&data.db, body.location_id).await {
        Ok(location) => location,
        Err((status_code, error_response)) => {
            return Err((status_code, error_response));
        }
    };

    match insert_new_station(&data.db, body.name, location.id, body.availability).await {
        Ok(station) => Ok((StatusCode::CREATED, Json(station))),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"status": "error","message": format!("{:?}", e)})),
        )),
    }
}

pub async fn handler_edit_station_by_id(
    Path(id): Path<i32>,
    State(data): State<Arc<AppState>>,
    Json(body): Json<UpdateChargingStation>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    match crate::db::charging_station::edit_by_id(&data.db, id, &body).await {
        Ok(updated_station) => Ok((StatusCode::OK, Json(updated_station))),
        Err((status_code, error_response)) => Err((status_code, error_response)),
    }
}
