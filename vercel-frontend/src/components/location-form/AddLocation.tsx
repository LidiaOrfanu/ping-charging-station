import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import './AddLocation.css';
import { ChargingStationLocation, ChargingStationLocationRequest, addLocation, getAllLocations } from '../api';
import CustomNotification from '../notification/CustomNotification';

interface AddLocationFormProps {
  onClose: () => void;
  setLocations: React.Dispatch<React.SetStateAction<ChargingStationLocation[]>>;
}

const AddLocationForm: React.FC<AddLocationFormProps> = ({ onClose, setLocations }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const initialValues = {
    street: '',
    zip: 0,
    city: '',
    country: '',
  };

  return (
    <div className="add-location-form">
       <h2 className="add-location-form__title">Add a new location:</h2>
      <Formik initialValues={initialValues}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                await addLocation(values as ChargingStationLocationRequest)
                .then(() => {
                  getAllLocations()
                    .then(data => {
                      setLocations(data);
                      // setSubmitting(false);
                      setShowSuccessMessage(true);
                        // onClose();
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
              {showSuccessMessage && <CustomNotification message="Successfully added a new location!" />}
              <div className="add-location-form__field">
                <label className="add-location-form__label">Street:</label>
                <Field type="text"
                      name="street"
                      className="add-location-form__input"
                      required />
              </div>
              <div className="add-location-form__field">
                <label className="add-location-form__label">Zip code:</label>
                <Field type="number"
                      name="zip"
                      className="add-location-form__input"
                      required />
              </div>
              <div className="add-location-form__field">
                <label className="add-location-form__label">City:</label>
                <Field type="text"
                      name="city"
                      className="add-location-form__input"
                      required />
              </div>
              <div className="add-location-form__field">
                <label className="add-location-form__label">Country:</label>
                <Field type="text"
                      name="country"
                      className="add-location-form__input"
                      required />
              </div>
              <div className="add-location-form__button-group">
                <button type="submit" className="add-location-form__submit-button">
                  Submit
                </button>
                <button onClick={onClose} className="add-location-form__close-button">
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
