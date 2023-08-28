import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import './AddStationForm.css';
import { ChargingStationLocation, StationResponse, addStation, getAllLocations } from '../api';
import { toast } from 'react-toastify';

interface AddStationFormProps {
  onClose: () => void;
}

const AddStationForm: React.FC<AddStationFormProps> = ({ onClose }) => {
  const [locations, setLocations] = useState<ChargingStationLocation[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const fetchedLocations = await getAllLocations();
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }
    fetchLocations();
  }, []);

  return (
    <div className="add-station-form-modal">
      <div className="add-station-form">
        <h2 className="add-station-form__title">Add a new charging station: </h2>
        <Formik
          initialValues={{
            name: '',
            location_id: '',
            availability: true,
          }}
          onSubmit={async (values, actions) => {
            const locationId = parseInt(values.location_id, 10);
            try {
              const response: StationResponse = await addStation({
                name: values.name,
                location_id: locationId,
                availability: values.availability,
              });
              actions.resetForm();
              onClose();
              console.log('Added station:', response.data.station);
              toast.success('Station added successfully!');
            } catch (error) {
              console.error('Error adding station:', error);
              toast.error('Error adding station.');
            }
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}> 
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
                      checked={values.availability === true}
                      onChange={handleChange}
                      className="add-station-form__radio"
                    />
                    Available
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="availability"
                      value="false"
                      checked={values.availability === false}
                      onChange={handleChange}
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
