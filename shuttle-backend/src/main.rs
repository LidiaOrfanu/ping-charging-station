use crate::routes::api_router::create_api_router;
use axum::http::{
    header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
    HeaderValue, Method,
};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::sync::Arc;
use tower_http::cors::CorsLayer;
mod handlers;
mod models;
mod routes;

pub struct AppState {
    db: Pool<Postgres>,
}

struct Db {
    secret: String,
}

#[shuttle_runtime::main]
pub async fn axum(
    #[shuttle_secrets::Secrets] secrets: shuttle_secrets::SecretStore,
) -> shuttle_axum::ShuttleAxum {
    let secret = if let Some(secret) = secrets.get("DATABASE_URL") {
        secret
    } else {
        return Err(anyhow::anyhow!("secret was not found").into());
    };
    let database_url = Db { secret };

    let pool = match PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url.secret)
        .await
    {
        Ok(pool) => pool,
        Err(_err) => {
            std::process::exit(1);
        }
    };

    let cors = CorsLayer::new()
        .allow_origin(
            "https://ping-charging-station.vercel.app"
                .parse::<HeaderValue>()
                .unwrap(),
        )
        .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::DELETE])
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);

    let app = create_api_router(Arc::new(AppState { db: pool.clone() })).layer(cors);

    Ok(app.into())
}
