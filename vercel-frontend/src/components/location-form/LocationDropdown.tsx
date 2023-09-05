import React from 'react';
import { ChargingStationLocation } from '../api-location';
import './LocationDropdown.css';
interface LocationDropdownProps 
{
    locations: ChargingStationLocation[];
    selectedLocation: number | null;
    onLocationChange: (value: number) => void;
}

function LocationDropdown({ locations, selectedLocation, onLocationChange }: LocationDropdownProps) {  return (
    <select
      name="selectLocation"
      className="location-form__input"
      value={selectedLocation || ''}
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

export default LocationDropdown;
