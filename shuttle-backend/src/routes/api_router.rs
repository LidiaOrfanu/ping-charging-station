use std::sync::Arc;

use axum::{
    routing::{get, post},
    Router,
};

use crate::{
    handlers::{charging_station::{
        handle_get_all_stations, handle_hello, handle_post_a_station,
        handler_edit_station_by_id, handler_get_station_by_id, handler_delete_station_by_id
    }, location::{handler_get_location_by_id, handler_post_a_location, handler_get_all_locations, handler_delete_location_by_id}},
    AppState,
};

pub fn create_api_locations_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/locations", get(handler_get_all_locations))
        .route("/api/location", post(handler_post_a_location))
        .route(
            "/api/location/:id",
            get(handler_get_location_by_id)
        //     .patch(handler_edit_location_by_id)
            .delete(handler_delete_location_by_id),
        )
        .with_state(app_state)
}

pub fn create_api_stations_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/stations", get(handle_get_all_stations))
        .route("/station", post(handle_post_a_station))
        .route(
            "/station/:id",
            get(handler_get_station_by_id)
            .patch(handler_edit_station_by_id)
            .delete(handler_delete_station_by_id),
        )
        .with_state(app_state)
}

pub fn create_api_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/hello", get(handle_hello))
        .nest("/api", create_api_stations_router(app_state.clone()))
        .nest("/api", create_api_locations_router(app_state.clone()))
}