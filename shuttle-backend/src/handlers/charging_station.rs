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

use crate::{
    db::charging_station::{check_station_name_existence, get_all, insert_new_station},
    models::charging_station::{ChargingStation, CreateChargingStation, UpdateChargingStation},
    AppState,
};

pub async fn handle_hello() {
    "Hello, Lalalala!".to_string();
}

pub async fn handle_get_all_stations(
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let db_clone = data.db.clone();

    match get_all(db_clone).await {
        Ok(stations) => Ok((StatusCode::OK, Json(stations))),
        Err(e) => {
            let error_response = json!({
                "status": "error",
                "message": format!("Error retrieving stations: {:?}", e)
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
        Err(e) => {
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"status": "error","message": format!("{:?}", e)})),
            ))
        }
    }
}

pub async fn handler_get_station_by_id(
    Path(id): Path<i32>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let query = "SELECT * FROM stations WHERE id = $1".to_string();
    let query_result = query_as::<_, ChargingStation>(&query)
        .bind(id)
        .fetch_one(&data.db)
        .await;
    // let query_result = query_as!(ChargingStation, "SELECT * FROM stations WHERE id = $1", id)
    //     .fetch_one(&data.db)
    //     .await;

    match query_result {
        Ok(station) => {
            let station_response = json!({
                "status": "success",
                "data": json!({
                    "station": station
                })
            });

            Ok((StatusCode::FOUND, Json(station_response)))
        }
        Err(_) => {
            let error_response = json!({
                "status": "fail",
                "message": format!("Station with ID: {} not found", id)
            });

            Err((StatusCode::NOT_FOUND, Json(error_response)))
        }
    }
}

pub async fn handler_edit_station_by_id(
    Path(id): Path<i32>,
    State(data): State<Arc<AppState>>,
    Json(body): Json<UpdateChargingStation>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let sql_query = "SELECT * FROM stations WHERE id = $1";
    let existing_station = query_as::<_, ChargingStation>(sql_query)
        .bind(id)
        .fetch_optional(&data.db)
        .await;

    if let Some(mut station) = existing_station.unwrap() {
        if let Some(new_name) = &body.name {
            if !new_name.is_empty() {
                station.name = new_name.clone();
            }
        }
        if let Some(new_availability) = body.availability {
            if new_availability == true || new_availability == false {
                station.availability = new_availability;
            }
        }

        let update_sql_query =
            "UPDATE stations SET name = $1, availability = $2 WHERE id = $3 RETURNING *";
        let updated_station: Result<ChargingStation, _> =
            query_as::<_, ChargingStation>(update_sql_query)
                .bind(station.name)
                .bind(station.availability)
                .bind(id)
                .fetch_one(&data.db)
                .await;

        match updated_station {
            Ok(updated) => Ok((StatusCode::OK, Json(updated))),
            Err(err) => {
                let error_response = json!({
                    "status": "error",
                    "message": format!("{:?}", err)
                });
                Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)))
            }
        }
    } else {
        let error_response = json!({
            "status": "fail",
            "message": format!("Station with ID: {} not found", id)
        });
        Err((StatusCode::NOT_FOUND, Json(error_response)))
    }
}

pub async fn handler_delete_station_by_id(
    Path(id): Path<String>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let id = id.trim().parse::<i32>().unwrap();
    let rows_affected = query("DELETE FROM stations WHERE id = $1")
        .bind(id)
        .execute(&data.db)
        .await
        .unwrap()
        .rows_affected();

    if rows_affected == 0 {
        let error_response = json!({
            "status": "fail",
            "message": format!("Station with ID: {} not found", id)
        });

        return Err((StatusCode::NOT_FOUND, Json(error_response)));
    }

    Ok(StatusCode::NO_CONTENT)
}
