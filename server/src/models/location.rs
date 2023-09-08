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

impl Location {
    pub fn update_street(&mut self, new_street: Option<String>) {
        if let Some(new_street) = new_street {
            if !new_street.is_empty() {
                self.street = new_street;
            }
        }
    }

    pub fn update_zip(&mut self, new_zip: Option<i32>) {
        if let Some(new_zip) = new_zip {
            if new_zip != 0 {
                self.zip = new_zip;
            }
        }
    }

    pub fn update_city(&mut self, new_city: Option<String>) {
        if let Some(new_city) = new_city {
            if !new_city.is_empty() {
                self.city = new_city;
            }
        }
    }

    pub fn update_country(&mut self, new_country: Option<String>) {
        if let Some(new_country) = new_country {
            if !new_country.is_empty() {
                self.country = new_country;
            }
        }
    }
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

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow, Validate)]
pub struct UpdateLocation {
    #[validate(length(min = 3, max = 35))]
    pub street: Option<String>,
    pub zip: Option<i32>,
    #[validate(length(min = 3, max = 15))]
    pub city: Option<String>,
    #[validate(length(min = 3, max = 15))]
    pub country: Option<String>,
}
