  import React, { useEffect, useState } from 'react';
  import './ChargingStationDashboard.css';
  import { ChargingStation, ChargingStationLocation, deleteLocationById, deleteStationById, getAllLocations, getAllStations } from '../api';
  import Header from '../header/Header';
  import DeleteStationForm from '../station-form/DeleteStation';
  import ChargingStationList from './ChargingStationList';
  import AddStationForm from '../station-form/AddStation';
  import AddLocationForm from '../location-form/AddLocation';
import DeleteLocationForm from '../location-form/DeleteLocation';

  function ChargingStationDashboard() {
    const [stations, setStations] = useState<ChargingStation[]>([]);
    const [locations, setLocations] = useState<ChargingStationLocation[]>([]);
    const [showAddStationForm, setShowAddStationForm] = useState(false);
    const [selectedStation, setSelectedStation] = useState<number | null>(null); 
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null); 
    const [showDeleteStationForm, setShowDeleteStationForm] = useState(false);
    const [showDeleteLocationForm, setShowDeleteLocationForm] = useState(false);
    const [showAddLocationForm, setShowAddLocationForm] = useState(false);

    const fetchStations = () => {
      getAllStations()
        .then(data => setStations(data))
        .catch(error => console.error('Error fetching stations:', error));
    };
    
    const fetchLocations = () => {
      getAllLocations()
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
    }

    const handleShowAddStationForm = () => {
      setShowAddStationForm(true);
    };

    const handleShowAddLocationForm = () => {
      setShowAddLocationForm(true);
      console.log('Add Location button clicked');
    };

    const handleShowDeleteStationForm = () => {
      setShowDeleteStationForm(true);
    };

    const handleShowDeleteLocationForm = () => {
      setShowDeleteLocationForm(true);
    };

    const handleCloseAddForm = () => {
      setShowAddStationForm(false);
      setShowAddLocationForm(false)
    };

    const handleCloseAddLocationForm = () => {
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

    const handleDeleteLocationClick = () => {
      console.log('handleDeleteLocationClick function called');
        if (selectedStation !== null) {
          deleteLocationById(selectedStation)
          .then(() => {
            fetchLocations();
          setShowDeleteLocationForm(false);
          })
          .catch(error => {
            console.error('Error deleting location:', error);
          });
          setShowDeleteLocationForm(false);
        }
      };
  
    useEffect(() => {
      fetchStations();
      fetchLocations();
    }, []);

    return (
      <div>
        <Header onAddStationClick={handleShowAddStationForm} 
                onDeleteStationClick={handleShowDeleteStationForm}
                onAddLocationClick={handleShowAddLocationForm}
                onDeleteLocationClick={handleShowDeleteLocationForm} />
        <ChargingStationList stations={stations} locations={locations} /> 
        {(showAddStationForm || showDeleteStationForm || showAddLocationForm || showDeleteLocationForm) && (
          <div className="modal">
          {showAddStationForm && (
              <AddStationForm onClose={handleCloseAddForm} locations={locations} setStations={setStations}/>
          )}
          {showAddLocationForm && (
              <AddLocationForm onClose={handleCloseAddLocationForm} setLocations={setLocations}/>
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
       
          {showDeleteLocationForm && (
            <DeleteLocationForm
              onClose={() => {
                setShowDeleteLocationForm(false);
                setSelectedLocation(null);
              }}
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationChange={(value) => setSelectedLocation(value)}
              onDeleteLocationClick={handleDeleteLocationClick}
            />
          )}
        </div>
        )}
    </div>
    );
  }

  export default ChargingStationDashboard;
