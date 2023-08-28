import React from 'react';
import { useParams } from 'react-router-dom';


const ChargingStationPage = () => {
  const { stationId } = useParams<{ stationId: string }>(); 

  console.log(stationId);
  // use stationId to fetch station details and display them
  return (
    <div>
      Hello from Details Page. here will be an edit station and location available
    </div>
  );
};

export default ChargingStationPage;
