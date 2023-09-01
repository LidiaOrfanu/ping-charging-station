  import React, { useEffect, useState } from 'react';
  import './ChargingStationDashboard.css';
  import AddStationForm from '../station-form/AddStationForm';
import { ChargingStation, ChargingStationLocation, deleteStationById, getAllLocations, getAllStations } from '../api';
import Header from '../header/Header';
import DeleteStationForm from '../station-form/DeleteStationForm';
import ChargingStationList from './ChargingStationList';

  function ChargingStationDashboard() {
    const [stations, setStations] = useState<ChargingStation[]>([]);
    const [locations, setLocations] = useState<ChargingStationLocation[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedStation, setSelectedStation] = useState<number | null>(null); 
    const [showDeleteForm, setShowDeleteForm] = useState(false);

    const handleShowAddForm = () => {
      setShowAddForm(true);
    };

    const handleShowDeleteForm = () => {
      setShowDeleteForm(true);
    };

    const handleCloseAddForm = () => {
      setShowAddForm(false);
    };

    const handleDeleteStationClick = () => {
      if (selectedStation !== null) {
        deleteStationById(selectedStation)
        .then(() => {
          getAllStations()
          .then(data => setStations(data))
          .catch(error => console.error('Error fetching stations:', error));
        setShowDeleteForm(false);
        })
        .catch(error => {
          console.error('Error deleting station:', error);
        });
        setShowDeleteForm(false);
      }
    };
    useEffect(() => {

      getAllStations()
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching stations:', error));

        getAllLocations()
        .then(data => setLocations(data))
        .catch(error => console.error('Error fetching locations:', error));
    }, []);

    return (
      <div>
        <Header onAddStationClick={handleShowAddForm} onDeleteStationClick={handleShowDeleteForm}/>
        <ChargingStationList stations={stations} locations={locations} /> 
        {(showAddForm || showDeleteForm) && (
          <div className="modal">
          {showAddForm && (
              <AddStationForm onClose={handleCloseAddForm} locations={locations}/>
          )}
          {showDeleteForm && (
            <DeleteStationForm
              onClose={() => {
                setShowDeleteForm(false);
                setSelectedStation(null);
              }}
              stations={stations}
              selectedStation={selectedStation}
              onStationChange={(value) => setSelectedStation(value)}
              onDeleteStationClick={handleDeleteStationClick}
            />
        )}
        </div>
        )}
    </div>
    );
  }

  export default ChargingStationDashboard;
