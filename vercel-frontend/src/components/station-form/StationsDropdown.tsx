import React from 'react';
import { ChargingStation } from '../api-station';

interface StationDropdownProps 
{
    stations: ChargingStation[];
    onStationChange: (value: number) => void;
}

function StationsDropdown({ stations,  onStationChange }: StationDropdownProps) {
  return (
    <select
      name="selectStation"
      className="station-form__input"
      onChange={(e) => {
        const value = parseInt(e.target.value, 10);
        onStationChange(value);
      }}
    >
      <option value="">Select a station</option>
      {stations.map((station) => (
        <option key={station.id} value={station.id}>
          {station.name}
        </option>
      ))}
    </select>
  );
}

export default StationsDropdown;
