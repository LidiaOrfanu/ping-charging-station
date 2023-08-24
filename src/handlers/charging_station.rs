use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use sqlx::query_as;
use validator::Validate;
use std::sync::Arc;

use crate::{
    models::charging_station::{
        ChargingStation, CreateChargingStation, CreatedResponse, UpdateChargingStation,
    },
    AppState,
};

pub async fn handle_hello() -> &'static str {
    return "Hello, World!";
}

pub async fn handle_post() -> impl IntoResponse {
    /*
        ContentType: Application/Json
        {"id": "28isi123k"}
    */
    let data = CreatedResponse {
        id: "28isi123k".to_string(),
    };
    Json(data)
}

pub async fn handle_get_all_stations(State(data): State<Arc<AppState>>) -> impl IntoResponse {
    const QUERY: &str = "SELECT id, name, location, availability FROM stations";
    let stations: Vec<ChargingStation> = query_as(QUERY).fetch_all(&data.db).await.unwrap();
    println!("\n=== select stations with query.map...: \n{:?}", stations);
    ((StatusCode::OK), Json(stations))
}

pub async fn handle_post_a_station(
    State(data): State<Arc<AppState>>,
    Json(body): Json<CreateChargingStation>,
) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
        // validate the data before using it
        if let Err(_valid_e) = body.validate() {
            // If validation fails, return an error response with the validation message
            let error_response = json!({
                "status": "error",
                "message": "Length problem".to_string()
            });
            return Err((StatusCode::BAD_REQUEST, Json(error_response)));
        }

        let query_existing = format!("SELECT * FROM stations WHERE name = $1");
        let existing_station = query_as::<_, ChargingStation>(&query_existing)
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
    
    let availability_value = if body.availability { "TRUE" } else { "FALSE" };
    let query = format!(
        "INSERT INTO stations (name, location, availability) VALUES ('{}', '{}', {}) RETURNING *",
        body.name, body.location, availability_value
    );

    let query_result = query_as::<_, ChargingStation>(&query)
        .fetch_one(&data.db)
        .await;

    match query_result {
        Ok(station) => {
            let station_response = json!({
                "status": "success",
                "data": {
                    "station": {
                        "id": station.id,
                        "name": station.name,
                        "location": station.location,
                        "availability": station.availability
                    }
                }
            });
            return Ok((StatusCode::CREATED, Json(station_response)));
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
    let query = format!("SELECT * FROM stations WHERE id = $1",);
    let query_result = query_as::<_, ChargingStation>(&query)
        .bind(id)
        .fetch_one(&data.db)
        .await;

    if query_result.is_err() {
        let error_response = json!({
            "status": "fail",
            "message": format!("Station with ID: {} not found", id)
        });

        return Err((StatusCode::NOT_FOUND, Json(error_response)));
    }

    let query = format!(
        "UPDATE stations SET name = $1, location = $2, availability = $3 WHERE id = $4 RETURNING *",
    );

    let name = body
        .name
        .map_or_else(|| "".to_string(), |value| value.clone());
    let location = body
        .location
        .map_or_else(|| "".to_string(), |value| value.clone());
    let availability = body.availability.unwrap_or(false);

    let query_result = query_as::<_, ChargingStation>(&query)
        .bind(name)
        .bind(location)
        .bind(availability)
        .bind(id)
        .fetch_one(&data.db)
        .await;

    match query_result {
        Ok(station) => {
            let station_response = json!({
                "status": "success",
                "data": json!({
                    "station": station
                })
            });
            return Ok((StatusCode::OK, Json(station_response)));
        }
        Err(err) => {
            let error_response = json!({
                "status": "error",
                "message": format!("{:?}", err)
            });

            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)));
        }
    }
}

// pub async fn handler_delete_station_by_id(
//     Path(id): Path<i32>,
//     State(data): State<Arc<AppState>>,
// ) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
//     let rows_affected = query!("DELETE FROM stations WHERE id = $1", id)
//         .execute(&data.db)
//         .await
//         .unwrap()
//         .rows_affected();

//     if rows_affected == 0 {
//         let error_response = json!({
//             "status": "fail",
//             "message": format!("Station with ID: {} not found", id)
//         });

//         return Err((StatusCode::NOT_FOUND, Json(error_response)));
//     }

//     Ok(StatusCode::NO_CONTENT)
// }
