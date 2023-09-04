import React, { useState } from 'react';
import { ChargingStation } from '../api';
import './DeleteStation.css';
import CustomNotification from '../notification/CustomNotification';
interface DeleteStationFormProps {
  stations: ChargingStation[];
  selectedStation: number | null;
  onStationChange: (value: number | null) => void;
  onDeleteStationClick: () => void;
  onClose: () => void;
}

const DeleteStationForm: React.FC<DeleteStationFormProps> = ({
  stations,
  selectedStation,
  onStationChange,
  onDeleteStationClick,
  onClose,
  }) => {
      const [showNotification, setShowNotification] = useState(false);
      const handleDeleteStationClick = () => {
      if (selectedStation !== null) {
        onDeleteStationClick();

        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 3000); 
      }
    };
  return (
    <div className="delete-station-form-modal">
      <div className="delete-station-form">
        <h2 className="delete-station-form__title">Delete a charging station: </h2>
        <form>
          <div className="delete-station-form__field">
            <label className="delete-station-form__label">Select a station to delete:</label>
            <select
              name="stationToDelete"
              className="delete-station-form__input"
              value={selectedStation || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                onStationChange(value);
              }}
            >
              <option value="">Select a station</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
          <div className="delete-station-form__button-group">
            <button
              type="button"
              onClick={handleDeleteStationClick}
              className="delete-station-form__submit-button"
              disabled={selectedStation === null}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="delete-station-form__close-button"
            >
              Cancel
            </button>
          </div>
        </form>
        {showNotification && <CustomNotification message="Station removed successfully!" />}
      </div>
    </div>
  );
};

export default DeleteStationForm;
