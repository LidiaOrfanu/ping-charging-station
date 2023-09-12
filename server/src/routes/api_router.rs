use std::sync::Arc;

use axum::{routing::get, Router};

use crate::{
    handlers::{
        charging_station::{
            handle_get_all_stations, handle_post_a_station, handler_delete_station_by_id,
            handler_edit_station_by_id, handler_get_station_by_id,
        },
        location::{
            handler_delete_location_by_id, handler_edit_location_by_id, handler_get_all_locations,
            handler_get_location_by_id, handler_post_a_location,
        },
    },
    AppState,
};

pub fn create_api_locations_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route(
            "/locations",
            get(handler_get_all_locations).post(handler_post_a_location),
        )
        .route(
            "/location/:id",
            get(handler_get_location_by_id)
                .patch(handler_edit_location_by_id)
                .delete(handler_delete_location_by_id),
        )
        .with_state(app_state)
}

pub fn create_api_stations_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route(
            "/stations",
            get(handle_get_all_stations).post(handle_post_a_station),
        )
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
        .nest("/api", create_api_stations_router(app_state.clone()))
        .nest("/api", create_api_locations_router(app_state.clone()))
}
