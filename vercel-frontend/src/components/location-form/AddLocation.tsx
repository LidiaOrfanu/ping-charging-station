import React from 'react';
import { Formik, Field, Form } from 'formik';
import './AddLocation.css';
import { ChargingStationLocationRequest, addLocation } from '../api';

interface AddLocationFormProps {
  onClose: () => void;
}

const AddLocation: React.FC<AddLocationFormProps> = ({ onClose }) => {
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
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                await addLocation(values as ChargingStationLocationRequest)
                resetForm();
                onClose();
              }}
              // validationSchema={validationSchema}
            >
      {({ handleSubmit }) => (
            <Form onSubmit= {handleSubmit}>
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

export default AddLocation;
