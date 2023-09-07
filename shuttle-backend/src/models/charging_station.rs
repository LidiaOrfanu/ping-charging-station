use serde::{Deserialize, Serialize};
use validator::Validate;
#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct ChargingStation {
    pub id: i32,
    pub name: String,
    pub location_id: Option<i32>,
    pub availability: bool,
}

impl ChargingStation {
    pub fn update_name(&mut self, new_name: String) {
        self.name = new_name;
    }

    pub fn update_availability(&mut self, new_availability: bool) {
        self.availability = new_availability;
    }
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow, Validate)]
pub struct CreateChargingStation {
    #[validate(length(min = 3, max = 35))]
    pub name: String,
    pub location_id: i32,
    pub availability: bool,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UpdateChargingStation {
    pub name: Option<String>,
    pub availability: Option<bool>,
    pub location_id: Option<i32>,
}
