import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChargingStation, getStationByID } from '../api';
// import EditStationNameForm from '../station-form/EditStationNameForm';


const ChargingStationPage = () => {
  const { stationId } = useParams();
  const [station, setStation] = useState<ChargingStation | null>(null);
  
  useEffect(() => {
    async function fetchStationDetails() {
      try {
        if (stationId) {
          const fetchedStation = await getStationByID(parseInt(stationId));
          setStation(fetchedStation);
        }
      } catch (error) {
        console.error('Error fetching station details:', error);
      }
    }
    fetchStationDetails();
  }, [stationId]);

  if (!station) {
    return (
      <div className="charging-station-page-container">
        <h1 className="charging-station-page-content">Loading...</h1>
      </div>
    );
  }
  // const handleNameChange = (newName: string) => {
  //   setStation(prevStation => {
  //     if (prevStation) {
  //       return { ...prevStation, name: newName };
  //     }
  //     return prevStation;
  //   });
  // };
  
  console.log(stationId);
  return (
    <div className="charging-station-page-container">
      <h1 className="charging-station-page-content">
        Station Details: {station.name}
      </h1>
      {/* <EditStationNameForm
        stationId={station.id}
        initialName={station.name}
        onSave={handleNameChange}
      /> */}
      <p>Availability: {station.availability ? 'Available' : 'Not Available'}</p>
    </div>
  );
};

export default ChargingStationPage;
