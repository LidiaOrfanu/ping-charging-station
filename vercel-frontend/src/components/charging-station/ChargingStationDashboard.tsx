import React, { useEffect, useState } from 'react';
import './ChargingStationDashboard.css';
import { ChargingStation, deleteStationById, getAllStations } from '../api-station';
import Header from '../header/Header';
import DeleteStationForm from '../station-form/DeleteStation';
import { ChargingStationLocation, getAllLocations, deleteLocationById } from '../api-location';
import ChargingStationList from './ChargingStationList';
import AddStationForm from '../station-form/AddStation';
import AddLocationForm from '../location-form/AddLocation';
import DeleteLocationForm from '../location-form/DeleteLocation';
import EditLocationForm from '../location-form/EditLocation';

  function ChargingStationDashboard() {
    const [stations, setStations] = useState<ChargingStation[]>([]);
    const [locations, setLocations] = useState<ChargingStationLocation[]>([]);
    const [selectedStation, setSelectedStation] = useState<number | null>(null); 
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null); 
    const [formMode, setFormMode] = useState<'addStation' | 'addLocation' | 'deleteStation' | 'deleteLocation' | 'editLocation'|null>(null);
   
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

    const handleFormToggle = (mode: 'addStation' | 'addLocation' | 'deleteStation' | 'deleteLocation' | 'editLocation') => {
      setFormMode(formMode === mode ? null : mode);
    };
  
    const handleCloseForm = () => {
      setFormMode(null);
    };

    const handleDeleteStationClick = () => {
      if (selectedStation !== null) {
        deleteStationById(selectedStation)
        .then(() => {
          fetchStations();
        })
        .catch(error => {
          console.error('Error deleting station:', error);
        });
      }
    };

    const handleDeleteLocationClick = () => {
        if (selectedLocation !== null) {
          deleteLocationById(selectedLocation)
          .then(() => {
            fetchLocations();
          })
          .catch(error => {
            console.error('Error deleting location:', error);
          });
        }
      };
  
    useEffect(() => {
      fetchStations();
      fetchLocations();
    }, []);

    return (
      <div>
        <Header  
          onAddStationClick={() => handleFormToggle('addStation')} 
          onDeleteStationClick={() => handleFormToggle('deleteStation')}
          onAddLocationClick={() => handleFormToggle('addLocation')}
          onEditLocationClick={() => handleFormToggle('editLocation')}
          onDeleteLocationClick={() => handleFormToggle('deleteLocation')} />
  
        <ChargingStationList stations={stations} locations={locations} /> 
        {formMode && (
          <div className="modal">
          {formMode === 'addStation' && (
              <AddStationForm onClose={handleCloseForm} locations={locations} setStations={setStations}/>
          )}
          {formMode === 'addLocation' && (
              <AddLocationForm onClose={handleCloseForm} setLocations={setLocations}/>
          )}
          {formMode === 'deleteStation' && (
            <DeleteStationForm onClose={() => {
                {handleCloseForm}
                setSelectedStation(null);
              }}
              stations={stations}
              selectedStation={selectedStation}
              onStationChange={(value) => setSelectedStation(value)}
              onDeleteStationClick={handleDeleteStationClick}
            />
        )}
       
          {formMode === 'deleteLocation' && (
            <DeleteLocationForm onClose={handleCloseForm}
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationChange={(value) => setSelectedLocation(value)}
              onDeleteLocationClick={handleDeleteLocationClick}
            />
          )}

          {formMode === 'editLocation' && (
            <EditLocationForm onClose={() => {
                {handleCloseForm}
                setSelectedLocation(null);
              }}
              locations={locations}
              selectedLocation={selectedLocation}
              setLocations={setLocations}
              onLocationChange={(value) => setSelectedLocation(value)}
            />
          )}
        </div>
        )}
    </div>
    );
  }

  export default ChargingStationDashboard;
