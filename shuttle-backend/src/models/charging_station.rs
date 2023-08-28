use serde::{Deserialize, Serialize};
use validator::Validate;
#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct ChargingStation {
    pub id: i32,
    pub name: String,
    pub location_id: i32,
    pub availability: bool,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow, Validate)]
pub struct CreateChargingStation {
    #[validate(length(min = 3, max = 15))]
    pub name: String,
    pub location_id: i32,
    pub availability: bool,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UpdateChargingStation {
    pub name: Option<String>,
    pub location_id: Option<i32>,
    pub availability: Option<bool>,
}
