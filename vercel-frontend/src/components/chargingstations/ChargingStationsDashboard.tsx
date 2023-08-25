import React, { useEffect, useState } from 'react';
import './ChargingStationsDashboard.css';

export interface ChargingStation {
  id: number;
  name: string;
  location: string;
  availability: boolean;
}

function ChargingStationsDashboard() {
  const [stations, setStations] = useState<ChargingStation[]>([]);

  useEffect(() => {
    fetch('https://ping-charging-station.shuttleapp.rs/api/stations')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1 className="station-title">Charging Stations</h1>
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
            <span className="address">{station.location}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChargingStationsDashboard;
