use serde::{Deserialize, Serialize};
use validator::Validate;
#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct ChargingStation {
    pub id: i32,
    pub name: String,
    pub location: String,
    pub availability: bool,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow, Validate)]
pub struct CreateChargingStation {
    #[validate(length(min = 3, max = 15))]
    pub name: String,
    #[validate(length(min = 3, max = 15))]
    pub location: String,
    pub availability: bool,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UpdateChargingStation {
    pub name: Option<String>,
    pub location: Option<String>,
    pub availability: Option<bool>,
}

#[derive(Serialize)]
pub struct CreatedResponse {
    pub id: String,
}
