use serde::{Deserialize, Serialize};
use validator::Validate;
// use validator::Validate;

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct Location {
    pub id: i32,
    pub street: String,
    pub zip: i32,
    pub city: String,
    pub country: String,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow, Validate)]
pub struct CreateLocation {
    #[validate(length(min = 3, max = 35))]
    pub street: String,
    pub zip: i32,
    #[validate(length(min = 3, max = 15))]
    pub city: String,
    #[validate(length(min = 3, max = 15))]
    pub country: String,
}
