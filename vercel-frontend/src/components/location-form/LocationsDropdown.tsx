import React from 'react';
import { ChargingStationLocation } from '../api-location';
import './LocationsDropdown.css';

interface LocationDropdownProps 
{
    locations: ChargingStationLocation[];
    onLocationChange: (value: number) => void;
}

function LocationsDropdown({ locations, onLocationChange }: LocationDropdownProps) {  
  console.log(locations)
  return (
    <select
      name="selectLocation"
      className="location-form__input"
      onChange={(e) => {
        const value = parseInt(e.target.value, 10);
        onLocationChange(value);
      }}
    >
      <option value="">Select a location</option>
      {locations.map((location) => (
        <option key={location.id} value={location.id}>
          {location.street}, {location.zip}, {location.city}, {location.country}
        </option>
      ))}
    </select>
  );
}

export default LocationsDropdown;
