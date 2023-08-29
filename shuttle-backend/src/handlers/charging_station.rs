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
    models::charging_station::{ChargingStation, CreateChargingStation, UpdateChargingStation},
    models::location::Location,
    AppState,
};

pub async fn handle_hello() -> &'static str {
    return "Hello, Lalalala!";
}

pub async fn handle_get_all_stations(
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    const QUERY: &str = "SELECT id, name, location_id, availability FROM stations";
    let result = query_as::<_, ChargingStation>(QUERY)
        .fetch_all(&data.db)
        .await;

    match result {
        Ok(stations) => {
            println!("\n=== select stations: \n{:?}", stations);
            Ok((StatusCode::OK, Json(stations)))
        }
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

    let sql_query_existing_station = format!("SELECT * FROM stations WHERE name = $1");
    let existing_station = query_as::<_, ChargingStation>(&sql_query_existing_station)
        .bind(&body.name)
        .fetch_optional(&data.db)
        .await
        .unwrap();

    if let Some(_) = existing_station {
        let error_response = json!({
            "status": "fail",
            "message": "Station with that name already exists",
        });
        return Err((StatusCode::CONFLICT, Json(error_response)));
    }

    let sql_query_location = "SELECT * FROM locations WHERE id = $1";
    let location = query_as::<_, Location>(&sql_query_location)
        .bind(&body.location_id)
        .fetch_one(&data.db)
        .await
        .map_err(|e| {
            (
                StatusCode::BAD_REQUEST,
                Json(json!({
                    "status": "error",
                    "message": format!("Invalid location_id: {:?}", e)
                })),
            )
        })?;

    let availability_value = if body.availability { "TRUE" } else { "FALSE" };
    let query = format!(
        "INSERT INTO stations (name, location_id, availability) VALUES ('{}', '{}', {}) RETURNING *",
        body.name, location.id, availability_value
    );

    let query_result = query_as::<_, ChargingStation>(&query)
        .fetch_one(&data.db)
        .await;

    match query_result {
        Ok(station) => {
            // let station_response = json!({
            //     "status": "success",
            //     "data": {
            //         "station": {
            //             "id": station.id,
            //             "name": station.name,
            //             "location_id": station.location_id,
            //             "availability": station.availability
            //         }
            //     }
            // });
            return Ok((StatusCode::CREATED, Json(station)));
        }
        Err(e) => {
            if e.to_string()
                .contains("duplicate key value violates unique constraint")
            {
                let error_response = json!({
                    "status": "fail",
                    "message": "Station with that name already exists",
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

pub async fn handler_get_station_by_id(
    Path(id): Path<i32>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    let query = format!("SELECT * FROM stations WHERE id = $1",);
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

            return Ok((StatusCode::FOUND, Json(station_response)));
        }
        Err(_) => {
            let error_response = json!({
                "status": "fail",
                "message": format!("Station with ID: {} not found", id)
            });

            return Err((StatusCode::NOT_FOUND, Json(error_response)));
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
            station.name = new_name.clone();
        }
        if let Some(new_availability) = body.availability {
            station.availability = new_availability;
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
