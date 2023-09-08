import React from 'react';
import { ChargingStation } from '../api-station';
import './DeleteStation.css';
import StationsDropdown from './StationsDropdown';
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
      const handleDeleteStationClick = () => {
      if (selectedStation !== null) {
        onDeleteStationClick();
      }
    };
  return (
    <div className="delete-station-form-modal">
      <div className="delete-station-form">
        <h2 className="delete-station-form__title">Delete a charging station: </h2>
        <form>
          <div className="delete-station-form__field">
            <StationsDropdown
              stations={stations}
              onStationChange={onStationChange}
            />
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
      </div>
    </div>
  );
};

export default DeleteStationForm;
