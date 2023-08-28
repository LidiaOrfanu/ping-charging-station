use serde::{Deserialize, Serialize};
// use validator::Validate;

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct Location {
    pub id: i32,
    pub street: String,
    pub zip: i32,
    pub city: String,
    pub country: String,
}