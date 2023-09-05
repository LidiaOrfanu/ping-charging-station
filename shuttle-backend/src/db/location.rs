use sqlx::{Postgres, query_as, Pool};

use crate::models::location::Location;

pub async fn get_all(pool: Pool<Postgres>) -> Result<Vec<Location>, sqlx::Error> {
    const QUERY: &str = "SELECT id, name, location_id, availability FROM stations";
    let locations = query_as::<_, Location>(QUERY)
        .fetch_all(&pool)
        .await;

    locations
}