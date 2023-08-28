import React from 'react';
import { Formik, Field, Form } from 'formik';
import './AddStationForm.css';

interface AddStationFormProps {
  onClose: () => void;
}

const AddStationForm: React.FC<AddStationFormProps> = ({ onClose }) => {
  return (
    <div className="add-station-form-modal">
      <div className="add-station-form">
        <h2 className="add-station-form__title">Add a new charging station: </h2>
        <Formik
          initialValues={{
            name: '',
            location: '',
            availability: true,
          }}
          onSubmit={(values, actions) => {
            // API call to add station using fetch
            // Reset form fields after successful submission
            actions.resetForm();
            onClose();
          }}
        >
          {({ values, handleChange }) => (
            <Form>
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
                  name="location"
                  className="add-station-form__input"
                >
                  {/* Render location options */}
                  {/* For example: */}
                  <option value="location_id1">Location 1</option>
                  <option value="location_id2">Location 2</option>
                  {/* ...and so on */}
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
