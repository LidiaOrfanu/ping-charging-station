use sqlx::{Postgres, query_as, Pool};

use crate::models::charging_station::ChargingStation;



pub async fn get_all(pool: Pool<Postgres>) -> Result<Vec<ChargingStation>, sqlx::Error> {
    const QUERY: &str = "SELECT id, name, location_id, availability FROM stations";
    let stations = query_as::<_, ChargingStation>(QUERY)
        .fetch_all(&pool)
        .await;

    stations
}