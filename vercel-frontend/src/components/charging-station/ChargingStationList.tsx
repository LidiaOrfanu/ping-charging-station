import React from 'react';
import { ChargingStation, ChargingStationLocation } from '../api';
import './ChargingStationList.css';

interface StationListProps {
    stations: ChargingStation[];
    locations: ChargingStationLocation[];
  }

function ChargingStationList({ stations, locations }: StationListProps) {
  return (
    <div className="station-list">
      <div className="station-header">
        <span className="status">Status</span>
        <span className="station-name">Station Name</span>
        <span className="address">Address</span>
      </div>
      {stations.map(station => (
        <div className="station-item" key={station.id}>
          <span className={`status ${station.availability ? 'available' : 'not-available'}`}>
            {station.availability ? 'Available' : 'Not Available'}
          </span>
          <span className="station-name">{station.name}</span>
          <span className="address">
            {locations.find(location => location.id === station.location_id)?.street},{' '}
            {locations.find(location => location.id === station.location_id)?.city},{' '}
            {locations.find(location => location.id === station.location_id)?.country}
          </span>
        </div>
      ))}
    </div>
  );
}


export default ChargingStationList;
