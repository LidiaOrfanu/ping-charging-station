// use std::path::PathBuf;
use crate::routes::route_all::routes;
use std::sync::Arc;
mod routes;

use sqlx::{Postgres, Pool};
// use tower_http::services::ServeDir;

pub struct AppState {
    db: Pool<Postgres>,
}

#[shuttle_runtime::main]
async fn axum(
    // Name your static assets folder by passing `folder = <name>` to `StaticFolder`
    // If you don't pass a name, it will default to `static`.
    #[shuttle_shared_db::Postgres] pool: sqlx::PgPool,
    // #[shuttle_static_folder::StaticFolder(folder = "assets")] static_folder: PathBuf,
) -> shuttle_axum::ShuttleAxum {
    sqlx::migrate!("db/migrations").run(&pool).await.expect("Migrations failed :(");

let app = routes(Arc::new(AppState { db: pool.clone() }));

Ok(app.into())
}