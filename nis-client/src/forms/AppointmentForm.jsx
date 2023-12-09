import React, { useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../shared/css/form.scss'; // Adjust the path if necessary

const AppointmentForm = () => {
    const toast = useRef(null);

    const onSubmit = async (data) => {
        
        toast.current.show({
            severity: 'success',
            summary: 'Termín naplánovaný',
            detail: 'Termín bol úspešne naplánovaný.'
        });
    };

    const required = (value) => (value ? undefined : 'Toto pole je povinné.');
    const isFutureDate = (value) => {
        if (!value) return 'Toto pole je povinné.';
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const selectedDate = new Date(value);
        return selectedDate >= today ? undefined : 'Dátum musí byť v budúcnosti.';
    };
    const isTimeValid = (value) => {
        if (!value) return 'Toto pole je povinné.';
        
        let hours, minutes;
        if (value instanceof Date) {
          hours = value.getHours();
          minutes = value.getMinutes();
        } else if (typeof value === 'string') {
          [hours, minutes] = value.split(':').map(Number);
        } else {
          return 'Neplatný čas';
        }
        if (hours < 8 || hours > 14 || (hours === 14 && minutes > 0)) {
          return 'Čas musí byť medzi 8:00 a 14:00.';
        }
      };

    const examinationTypes = [
        { label: 'Iné vyšetrenie', code: '02089744193' },
        { label: 'Kontrolné vyšetrenie', code: '02089744151' },
        { label: 'Konzultácie', code: '02089744250' },
        { label: 'Liečba', code: '02089744235' },
        { label: 'Odbery', code: '02089744219' },
        { label: 'Predoperačné vyšetrenie', code: '02089744177' },
        { label: 'Preventívna prehliadka', code: '02089744136' },
        { label: 'Vstupné vyšetrenie', code: '02089744102' },
        { label: 'Vyšetrenie', code: '02089744086' },
    ];

    const medicalProcedures = [
        { label: 'Lekárske ošetrenie', code: '02089729756'},
        { label: 'Očkovanie', code: '02089714659'},
        { label: 'Odber krvi', code: '02089714618'},
        { label: 'Preventívna prehliadka', code: '00000467373'},
        { label: 'Zubné ošetrenie', code: '02089729764'},
    ];

    return (
        <div className="form appointment-form">
            <Toast ref={toast} />
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, form, submitting, pristine, valid }) => (
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <Field name="date" validate={isFutureDate}>
                            {({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Calendar id="date" {...input} dateFormat="yy-mm-dd" showIcon />
                                        <label htmlFor="date">Dátum vyšetrenia*</label>
                                    </span>
                                    {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                </div>
                            )}
                        </Field>

                        <Field name="time" validate={isTimeValid}>
                            {({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Calendar id="time" {...input} timeOnly showTime />
                                        <label htmlFor="time">Čas vyšetrenia*</label>
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
                                        <label htmlFor="examinationType">Typ vyšetrenia*</label>
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
                                        <label htmlFor="medicalProcedure">Lekársky zákrok*</label>
                                    </span>
                                    {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                </div>
                            )}
                        </Field>

                        <Button 
                            type="submit" 
                            label="Naplánovať vyšetrenie"     
                            disabled={submitting || !valid} 
                            className="mt-2" />
                    </form>
                )}
            />
        </div>
    );
};

export default AppointmentForm;
