import React from 'react';
import { ChargingStation } from '../api';
import './DeleteStationForm.css';
interface DeleteStationFormProps {
  stations: ChargingStation[]; // An array of stations to choose from
  selectedStation: number | null; // The selected station to delete
  onStationChange: (value: number | null) => void; // Callback when a station is selected
  onDeleteStationClick: () => void; // Callback when the delete button is clicked
  onClose: () => void; // Callback when the form is closed
}

const DeleteStationForm: React.FC<DeleteStationFormProps> = ({
  stations,
  selectedStation,
  onStationChange,
  onDeleteStationClick,
  onClose,
}) => {
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
              onClick={onDeleteStationClick}
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
