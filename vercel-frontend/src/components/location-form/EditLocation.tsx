import React from 'react';
import { Formik, Field, Form } from 'formik';
import './EditLocation.css';
import { ChargingStationLocation, ChargingStationLocationRequest, getAllLocations, updateLocationById } from '../api-location';
import LocationDropdown from './LocationDropdown';

interface EditLocationFormProps {
    locations: ChargingStationLocation[];
    selectedLocation: number | null;
    setLocations: React.Dispatch<React.SetStateAction<ChargingStationLocation[]>>;
    onLocationChange: (value: number | null) => void;
    onEditLocationClick: () => void;
    onClose: () => void;
}

const AddLocationForm: React.FC<EditLocationFormProps> = ({
    locations,
    selectedLocation,
    setLocations,
    onLocationChange,
    onEditLocationClick,
    onClose,
}) => {

  const initialValues = {
    street: '',
    zip: 0,
    city: '',
    country: '',
  };

  const handleEditLocationClick = async () => {
    if (selectedLocation !== null) {
      try {
        await onEditLocationClick();
      } catch (error) {
        console.error('Error updating location:', error);
      }
    }
  }; 
  return (
    <div className="edit-location-form">
       <h2 className="edit-location-form__title">Edit a location:</h2>
       <div className="edit-location-form__field">
            <select
              name="locationToEdit"
              className="edit-location-form__input"
              value={selectedLocation || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                onLocationChange(value);
              }}
            >
            <LocationDropdown
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationChange={onLocationChange}
            />
            </select>
          </div>

      <Formik initialValues={initialValues}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                await updateLocationById(selectedLocation, values as ChargingStationLocationRequest)
                .then(() => {
                  getAllLocations()
                    .then(data => {
                      setLocations(data);
                      setSubmitting(false);
                        onClose();
                    })
                    .catch(error => {
                      console.error('Error fetching locations:', error);
                      setSubmitting(false);
                    });
                })
                .catch(error => {
                  console.error('Error adding location:', error);
                  setSubmitting(false);
                });
              }}
            >
      {({ handleSubmit }) => (
            <Form onSubmit= {handleSubmit}>
              <div className="edit-location-form__field">
                <label className="edit-location-form__label">Street:</label>
                <Field type="text"
                      name="street"
                      className="edit-location-form__input"
                />
              </div>
              <div className="edit-location-form__field">
                <label className="edit-location-form__label">Zip code:</label>
                <Field type="number"
                      name="zip"
                      className="edit-location-form__input"
                />
              </div>
              <div className="edit-location-form__field">
                <label className="edit-location-form__label">City:</label>
                <Field type="text"
                      name="city"
                      className="edit-location-form__input"
                />
              </div>
              <div className="edit-location-form__field">
                <label className="edit-location-form__label">Country:</label>
                <Field type="text"
                      name="country"
                      className="edit-location-form__input"
                />
              </div>
              <div className="edit-location-form__button-group">
                <button onClick={handleEditLocationClick} className="edit-location-form__submit-button">
                  Submit
                </button>
                <button onClick={onClose} className="edit-location-form__close-button">
                  Cancel
                </button>
              </div>
            </Form>
      )}
      </Formik>
    </div>
  );
};

export default AddLocationForm;
