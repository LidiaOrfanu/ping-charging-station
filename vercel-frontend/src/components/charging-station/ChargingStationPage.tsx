import React from 'react';
import { useParams } from 'react-router-dom';


const ChargingStationPage = () => {
  const { stationId } = useParams<{ stationId: string }>(); 

  console.log(stationId);
  // use stationId to fetch station details and display them
  return (
    <div className="charging-station-page-container">
      <h1 className="charging-station-page-content">
        Hello from Details Page. Here will be an edit station and location available.
      </h1>
    </div>
  );
};

export default ChargingStationPage;
