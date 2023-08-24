use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::sync::Arc;

use crate::routes::api_router::create_api_router;
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
pub async fn axum (
// #[shuttle_shared_db::Postgres] postgres: PgPool,
#[shuttle_secrets::Secrets] secrets: shuttle_secrets::SecretStore
) -> shuttle_axum::ShuttleAxum {
    let secret = if let Some(secret) = secrets.get("DATABASE_URL") {
        secret
    } else {
        return Err(anyhow::anyhow!("secret was not found").into());
    };
    let database_url = Db{secret};
    // let (key, database_url) = env.split_once('=').unwrap();
    // assert_eq!(key, "DATABASE_URL");
    let pool = match PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url.secret)
        .await
    {
        Ok(pool) => {
            print!("🦀 Succesfull connection to the database");
            pool
        }
        Err(err) => {
            println!("💣 Failed to connect: {err}");
            std::process::exit(1);
        }
    };

    let app = create_api_router(Arc::new(AppState { db: pool.clone() }));

Ok(app.into())
}
