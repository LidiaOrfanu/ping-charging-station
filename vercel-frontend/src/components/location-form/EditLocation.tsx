import React from 'react';
import { Formik, Field, Form } from 'formik';
import './EditLocation.css';
import { ChargingStationLocation, ChargingStationLocationRequest, getAllLocations, updateLocationById } from '../api-location';
import LocationsDropdown from './LocationsDropdown';

interface EditLocationFormProps {
    locations: ChargingStationLocation[];
    selectedLocation: number | null;
    setLocations: React.Dispatch<React.SetStateAction<ChargingStationLocation[]>>;
    onLocationChange: (value: number | null) => void;
    onClose: () => void;
}

const EditLocationForm: React.FC<EditLocationFormProps> = ({
    locations,
    selectedLocation,
    setLocations,
    onLocationChange,
    onClose,
}) => {

  const initialValues = {
    street: '',
    zip: 0,
    city: '',
    country: '',
  };

  return (
    <div className="edit-location-form">
       <h2 className="edit-location-form__title">Edit a location:</h2>
       <div className="edit-location-form__field">
            <LocationsDropdown
              locations={locations}
              onLocationChange={onLocationChange}
            />
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
        //   if (selectedLocation !== null) {
        //     try {
        //       await updateLocationById(selectedLocation, values as ChargingStationLocationRequest);
        //       const updatedLocations = await getAllLocations();
        //       setLocations(updatedLocations);
        //       setSubmitting(false);
        //       onClose();
        //     } catch (error) {
        //       console.error('Error editing location:', error);
        //       setSubmitting(false);
        //     }
        //   } else {
        //     console.error('Error editing location: No location selected');
        //     setSubmitting(false);
        //   }
        // }}
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
                <button type="submit" className="edit-location-form__submit-button" disabled={selectedLocation === null}>
                  Submit
                </button>
                <button  type="button" onClick={onClose} className="edit-location-form__close-button">
                  Cancel
                </button>
              </div>
            </Form>
      )}
      </Formik>
    </div>
  );
};

export default EditLocationForm;
