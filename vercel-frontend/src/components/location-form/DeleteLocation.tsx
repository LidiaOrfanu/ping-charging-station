import React, { useState } from 'react';
import { ChargingStationLocation } from '../api';
import './DeleteLocation.css';
import CustomNotification from '../notification/CustomNotification';
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
      const [showNotification, setShowNotification] = useState(false);
      const handleDeleteLocationClick = () => {
      if (selectedLocation !== null) {
        onDeleteLocationClick();

        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 3000); 
      }
    };
  return (
    <div className="delete-location-form-modal">
      <div className="delete-location-form">
        <h2 className="delete-location-form__title">Delete a charging location: </h2>
        <form>
          <div className="delete-location-form__field">
            <select
              name="locationToDelete"
              className="delete-location-form__input"
              value={selectedLocation || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                onLocationChange(value);
              }}
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.street}, {location.zip}, {location.city}, {location.country}
                </option>
              ))}
            </select>
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
        {showNotification && <CustomNotification message="Location removed successfully!" />}
      </div>
    </div>
  );
};

export default DeleteLocationForm;
