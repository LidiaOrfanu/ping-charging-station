import React, { useEffect, useState } from 'react';

interface Station {
  id: number;
  name: string;
  location: string;
  availability: boolean;
}

function StationList() {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    fetch('https://ping-charging-station.shuttleapp.rs/api/stations')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Station List</h1>
      <ul>
        {stations.map(station => (
          <li key={station.id}>
            {station.name} - {station.location} ({station.availability ? 'Available' : 'Not Available'})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StationList;
