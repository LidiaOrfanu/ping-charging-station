import React from 'react';
import { ChargingStationLocation } from '../api-location';
import './DeleteLocation.css';
import LocationsDropdown from './LocationsDropdown';
interface DeleteLocationFormProps {
  locations: ChargingStationLocation[];
  selectedLocation: number | null;
  onLocationChange: (value: number | null) => void;
  onDeleteLocationClick: () => void;
  onClose: () => void;
}

const DeleteLocationForm: React.FC<DeleteLocationFormProps> = ({
  locations,
  selectedLocation,
  onLocationChange,
  onDeleteLocationClick,
  onClose,
  }) => {
      const handleDeleteLocationClick = async () => {
      if (selectedLocation !== null) {
        try {
          await onDeleteLocationClick();
        } catch (error) {
          console.error('Error deleting location:', error);
        }
      }
    }; 

  return (
      <div className="delete-location-form">
        <h2 className="delete-location-form__title">Delete a charging location: </h2>
        <form>
          <div className="delete-location-form__field">
            <LocationsDropdown
              locations={locations}
              onLocationChange={onLocationChange}
            />
          </div>

          <div className="delete-location-form__button-group">
            <button
              type="button"
              onClick={handleDeleteLocationClick}
              className="delete-location-form__submit-button"
              disabled={selectedLocation === null}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="delete-location-form__close-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
  );
};

export default DeleteLocationForm;
