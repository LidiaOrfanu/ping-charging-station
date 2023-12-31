import { Formik, Field, Form } from 'formik';
import './AddStation.css';
import { ChargingStation, addStation, getAllStations } from '../api-station';
import React, { useState } from 'react';
import { ChargingStationLocation } from '../api-location';

interface AddStationFormProps {
  onClose: () => void;
  locations: ChargingStationLocation[];
  setStations: React.Dispatch<React.SetStateAction<ChargingStation[]>>;
}

const AddStationForm: React.FC<AddStationFormProps> = ({ onClose, locations , setStations}) => {
  const [availability, setAvailability] = useState(true);
  
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAvailability = e.target.value === 'true';
    setAvailability(newAvailability);
  };

  const initialValues = {
    name: '',
    location_id: '',
    availability: true,
  };

  return (
    <div className="add-station-form-modal">
      <div className="add-station-form">
        <h2 className="add-station-form__title">Add a new charging station: </h2>
        <Formik initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            const locationId = parseInt(values.location_id, 10);
            addStation({
                name: values.name,
                location_id: locationId,
                availability: availability,
              })
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
              <div className="add-station-form__field">
                <label className="add-station-form__label">Name:</label>
                <Field
                  type="text"
                  name="name"
                  className="add-station-form__input"
                />
              </div>
              <div className="add-station-form__field">
                <label className="add-station-form__label">Location:</label>
                <Field
                  as="select"
                  name="location_id"
                  className="add-station-form__input"
                >
                  <option value="">Select a location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id.toString()}>
                      {location.street}, {location.city}, {location.country}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="add-station-form__field">
                <label className="add-station-form__label">Status:</label>
                <div className="add-station-form__radio-group">
                  <label>
                    <Field
                      type="radio"
                      name="availability"
                      value="true"
                      checked={availability === true}
                      onChange={handleAvailabilityChange}
                      className="add-station-form__radio"
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
                      className="add-station-form__radio"
                    />
                    Not Available
                  </label>
                </div>
              </div>
              <div className="add-station-form__button-group">
                <button type="submit" className="add-station-form__submit-button">
                  Submit
                </button>
                <button onClick={onClose} className="add-station-form__close-button">
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddStationForm;
