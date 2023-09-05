import React from 'react';
import { Formik, Field, Form } from 'formik';
import './EditLocation.css';
import { ChargingStation, UpdateChargingStationRequest, getAllStations, updateStationById } from '../api-station';
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

  const initialValues = {
    availability: null,
    name: '',
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
                await updateStationById(selectedStation, values as UpdateChargingStationRequest)
                .then(() => {
                  getAllStations()
                    .then(data => {
                      setStations(data);
                      setSubmitting(false);
                        onClose();
                    })
                    .catch(error => {
                      console.error('Error fetching locations:', error);
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
                <label className="edit-station-form__label">Charging Station Name:</label>
                <Field type="text"
                      name="name"
                      className="edit-station-form__input"
                />
              </div>
              <div className="edit-station-form__field">
                <label className="edit-station-form__label">Availability:</label>
                <Field type="bool"
                      name="availability"
                      className="edit-station-form__input"
                />
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
