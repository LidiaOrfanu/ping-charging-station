  import React, { useEffect, useState } from 'react';
  import './ChargingStationDashboard.css';
  import { ChargingStation, ChargingStationLocation, deleteStationById, getAllLocations, getAllStations } from '../api';
  import Header from '../header/Header';
  import DeleteStationForm from '../station-form/DeleteStation';
  import ChargingStationList from './ChargingStationList';
import AddStationForm from '../station-form/AddStation';
import AddLocation from '../location-form/AddLocation';

  function ChargingStationDashboard() {
    const [stations, setStations] = useState<ChargingStation[]>([]);
    const [locations, setLocations] = useState<ChargingStationLocation[]>([]);
    const [showAddStationForm, setShowAddStationForm] = useState(false);
    const [selectedStation, setSelectedStation] = useState<number | null>(null); 
    const [showDeleteStationForm, setShowDeleteStationForm] = useState(false);
    const [showAddLocationForm, setShowAddLocationForm] = useState(false);

    const fetchStations = () => {
      getAllStations()
        .then(data => setStations(data))
        .catch(error => console.error('Error fetching stations:', error));
    };
    
    const handleShowAddStationForm = () => {
      setShowAddStationForm(true);
    };
    const handleShowAddLocationForm = () => {
      setShowAddLocationForm(true);
    };

    const handleShowDeleteForm = () => {
      setShowDeleteStationForm(true);
    };

    const handleCloseAddForm = () => {
      setShowAddStationForm(false);
      setShowAddLocationForm(false)
    };

    const handleDeleteStationClick = () => {
      if (selectedStation !== null) {
        deleteStationById(selectedStation)
        .then(() => {
          fetchStations();
        setShowDeleteStationForm(false);
        })
        .catch(error => {
          console.error('Error deleting station:', error);
        });
        setShowDeleteStationForm(false);
      }
    };

    useEffect(() => {
      fetchStations();

        getAllLocations()
        .then(data => setLocations(data))
        .catch(error => console.error('Error fetching locations:', error));
    }, []);

    return (
      <div>
        <Header onAddStationClick={handleShowAddStationForm} 
                onDeleteStationClick={handleShowDeleteForm}
                onAddLocationClick={handleShowAddLocationForm} />
        <ChargingStationList stations={stations} locations={locations} /> 
        {(showAddStationForm || showDeleteStationForm || showAddLocationForm) && (
          <div className="modal">
          {showAddStationForm && (
              <AddStationForm onClose={handleCloseAddForm} locations={locations} setStations={setStations}/>
          )}
          {showAddStationForm && (
              <AddLocation onClose={handleCloseAddForm} />
          )}
          {showDeleteStationForm && (
            <DeleteStationForm
              onClose={() => {
                setShowDeleteStationForm(false);
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
