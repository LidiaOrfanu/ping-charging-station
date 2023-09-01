  import React, { useEffect, useState } from 'react';
  import './ChargingStationDashboard.css';
  import AddStationForm from '../station-form/AddStationForm';
import { ChargingStation, ChargingStationLocation, deleteStationById, getAllLocations, getAllStations } from '../api';
import Header from '../header/Header';
import DeleteStationForm from '../station-form/DeleteStationForm';

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
    </div>
    );
  }

  export default ChargingStationDashboard;
