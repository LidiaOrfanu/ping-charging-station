import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import './EditStation.css';
import { ChargingStation, getAllStations, updateStationById } from '../api-station';
import StationsDropdown from './StationsDropdown';

interface EditStationFormProps {
    stations: ChargingStation[];
    selectedStation: number | null;
    setStations: React.Dispatch<React.SetStateAction<ChargingStation[]>>;
    onStationChange: (value: number | null) => void;
    onClose: () => void;
}

const EditStationForm: React.FC<EditStationFormProps> = ({
    stations,
    selectedStation,
    setStations,
    onStationChange,
    onClose,
}) => {

    const [availability, setAvailability] = useState(true);

  const initialValues = {
    availability: true,
    name: '',
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAvailability = e.target.value === 'true';
    setAvailability(newAvailability);
  };

  return (
    <div className="edit-station-form">
       <h2 className="edit-station-form__title">Edit a station:</h2>
       <div className="edit-station-form__field">
            <StationsDropdown
              stations={stations}
              onStationChange={onStationChange}
            />
          </div>

      <Formik initialValues={initialValues}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                await updateStationById(
                    selectedStation, 
                    {name: values.name, 
                    availability: availability})
                .then(() => {
                  getAllStations()
                    .then(data => {
                      setStations(data);
                      setSubmitting(false);
                        onClose();
                    })
                    .catch(error => {
                      console.error('Error fetching stations:', error);
                      setSubmitting(false);
                    });
                })
                .catch(error => {
                  console.error('Error adding station:', error);
                  setSubmitting(false);
                });
              }}
        >
      {({ handleSubmit }) => (
            <Form onSubmit= {handleSubmit}>
              <div className="edit-station-form__field">
                <label className="edit-station-form__label">Station Name:</label>
                <Field type="text"
                      name="name"
                      className="edit-station-form__input"
                />
              </div>
              <div className="edit-station-form__field">
                <label className="edit-station-form__label">Status:</label>
                <div className="edit-station-form__radio-group">
                  <label>
                    <Field
                      type="radio"
                      name="availability"
                      value="true"
                      checked={availability === true}
                      onChange={handleAvailabilityChange}
                      className="edit-station-form__radio"
                    />
                    Available
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="availability"
                      value="false"
                      checked={availability === false}
                      onChange={handleAvailabilityChange}
                      className="edit-station-form__radio"
                    />
                    Not Available
                  </label>
                </div>
              </div>
              <div className="edit-station-form__button-group">
                <button type="submit" className="edit-station-form__submit-button" disabled={selectedStation === null}>
                  Submit
                </button>
                <button  type="button" onClick={onClose} className="edit-station-form__close-button">
                  Cancel
                </button>
              </div>
            </Form>
      )}
      </Formik>
    </div>
  );
};

export default EditStationForm;
