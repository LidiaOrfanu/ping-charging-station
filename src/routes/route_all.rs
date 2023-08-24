use std::sync::Arc;

use axum::{
    routing::get,
    Router, extract::State, response::IntoResponse, http::StatusCode, Json,
};
use sqlx::query_as;

use crate::AppState;

// use crate::{
//     handlers::charging_station::{
//         handle_get_all_stations, handle_hello, handle_post, handle_post_a_station,
//         handler_delete_station_by_id, handler_edit_station_by_id, handler_get_station_by_id,
//     },
//     AppState,
// };

pub async fn handle_hello() -> &'static str {
    return "Hello, World!";
}

use serde::{Deserialize, Serialize};
// use validator::Validate;
#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct Location {
    pub id: i32,
    pub street: String,
    pub zip: i32,
    pub city: String,
    pub country: String,
}

pub async fn handle_get_all_locations(State(data): State<Arc<AppState>>) -> impl IntoResponse {
    const QUERY: &str = "SELECT id, name, location, availability FROM locations";
    let locations: Vec<Location> = query_as(QUERY).fetch_all(&data.db).await.unwrap();
    println!("\n=== select locations with query.map...: \n{:?}", locations);
    ((StatusCode::OK), Json(locations))
}

pub fn build_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/hello", get(handle_hello))
        .route("/api/locations", get(handle_get_all_locations))
        .with_state(app_state)
}