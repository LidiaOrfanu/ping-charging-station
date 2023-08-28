use std::sync::Arc;

use axum::{
    routing::{get, post},
    Router,
};

use crate::{
    handlers::charging_station::{
        handle_get_all_stations, handle_hello, handle_post_a_station,
        handler_edit_station_by_id, handler_get_station_by_id, handler_delete_station_by_id
    },
    AppState,
};

pub fn create_api_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/hello", get(handle_hello))
        .route("/api/stations", get(handle_get_all_stations))
        .route("/api/station", post(handle_post_a_station))
        .route(
            "/api/station/:id",
            get(handler_get_station_by_id)
            .patch(handler_edit_station_by_id)
            .delete(handler_delete_station_by_id),
        )
        .with_state(app_state)
}
