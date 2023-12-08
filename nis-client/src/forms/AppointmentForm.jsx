import React from 'react';
import { Form, Field } from 'react-final-form';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const AppointmentForm = () => {
  const toast = React.useRef(null);

  const onSubmit = async (data) => {
    // Submit the form data to your backend
    console.log(data);
    // Show a success message
    toast.current.show({ severity: 'success', summary: 'Appointment Scheduled', detail: 'The appointment has been successfully scheduled.' });
  };

  const required = (value) => (value ? undefined : 'This field is required');

  // Mock data, replace with your actual fetch calls
  const examinationTypes = [
    { label: 'General Checkup', code: 'GC' },
    { label: 'Dental Examination', code: 'DE' },
    // ... other types
  ];

  const medicalProcedures = [
    { label: 'Blood Test', code: 'BT' },
    { label: 'X-ray', code: 'XR' },
    // ... other procedures
  ];

  return (
    <div className="appointment-form">
      <Toast ref={toast} />
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className="p-fluid">
            <Field name="date" validate={required}>
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <Calendar id="date" {...input} dateFormat="yy-mm-dd" showIcon />
                    <label htmlFor="date">Appointment Date*</label>
                  </span>
                  {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                </div>
              )}
            </Field>

            <Field name="time" validate={required}>
            {({ input, meta }) => (
                <div className="field">
                <span className="p-float-label">
                    {/* Remove the format property for the time-only Calendar */}
                    <Calendar id="time" {...input} timeOnly showTime />
                    <label htmlFor="time">Appointment Time*</label>
                </span>
                {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                </div>
            )}
            </Field>

            <Field name="examinationType" validate={required}>
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <Dropdown id="examinationType" {...input} options={examinationTypes} optionLabel="label" />
                    <label htmlFor="examinationType">Examination Type*</label>
                  </span>
                  {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                </div>
              )}
            </Field>

            <Field name="medicalProcedure" validate={required}>
              {({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <Dropdown id="medicalProcedure" {...input} options={medicalProcedures} optionLabel="label" />
                    <label htmlFor="medicalProcedure">Medical Procedure*</label>
                  </span>
                  {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                </div>
              )}
            </Field>

            <Button type="submit" label="Schedule Appointment" disabled={submitting || pristine} />
          </form>
        )}
      />
    </div>
  );
};

export default AppointmentForm;
