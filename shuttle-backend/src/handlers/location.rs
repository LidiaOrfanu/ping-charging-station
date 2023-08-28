use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::{json, Value};
use sqlx::query_as;
use std::sync::Arc;
// use validator::Validate;

use crate::AppState;
use crate::models;

pub async fn handle_get_all_locations(State(data): State<Arc<AppState>>) -> Result<impl IntoResponse, (StatusCode, Json<Value>)> {
    const QUERY: &str = "SELECT id, street, zip, city, country FROM locations";
    let result = query_as::<_, models::location::Location>(QUERY).fetch_all(&data.db).await;

    match result {
        Ok(locations) => {
            Ok((StatusCode::OK, Json(locations)))
        }
        Err(e) => {
            let error_response = json!({
                "status": "error",
                "message": format!("Error retrieving locations: {:?}", e)
            });
            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)))
        }
    }
}