import React from 'react';
import { ChargingStation } from '../api-station';
import './ChargingStationList.css';
import { ChargingStationLocation } from '../api-location';

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
          {/* <span className={`status ${station.availability ? 'available' : 'not-available'}`}>
            {station.availability ? 'Available' : 'Not Available'}
          </span> */}
          <div className="status-container">
            {/* Use the circle class with dynamic classNames */}
            <span className={`status-circle ${station.availability ? 'available' : 'not-available'}`} />
            {/* Text immediately after the circle */}
            <span className="status-text">{station.availability ? 'Available' : 'Not Available'}</span>
          </div>
          <span className="station-name">{station.name}</span>
          <span className="address">
          {station.location_id !== null ? (
            <>
            {locations.find(location => location.id === station.location_id)?.street},{' '}
            {locations.find(location => location.id === station.location_id)?.city},{' '}
            {locations.find(location => location.id === station.location_id)?.country}
            </>
          ) : (
            "No Location Assigned"
          )}
          </span>
        </div>
      ))}
    </div>
  );
}


export default ChargingStationList;
