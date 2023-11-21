import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useLocation, useNavigate } from 'react-router';

export default function VaccineForm() {
  const [typeVaccinations, setTypeVaccinations] = useState([]);
  const [doseVaccines, setDoseVaccines] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [vaccineId, setVaccineId] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState({
    typeVaccination: '',
    dateVaccination: new Date(),
    dateReVaccination: new Date(),
    doseVaccine: '',
  });
  const toast = useRef(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) return;
    setPatientId(state.patientId);
    setVaccineId(state.vaccineId);
  }, []);

  useEffect(() => {
    if (!vaccineId) return;
    fetchFormInitialValues();
  }, [vaccineId]);

  useEffect(() => {
    fetchVaccineDoses();
    fetchVaccineType();
  }, []);

  const fetchFormInitialValues = () => {
    if (!vaccineId || !patientId) return;

    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/vaccine/${vaccineId}/patient/${patientId}`, {
      headers,
    })
      .then((response) => response.json())
      .then(async (data) => {
        const initialValuesFromDb = {
          typeVaccination: await fetchInitialTypeVaccination(data.VACCINE_NAME),
          dateVaccination: new Date(data.VACCINATION_DATE),
          dateReVaccination: new Date(data.VACCINATION_NEXT_DATE),
          doseVaccine: await fetchInitialDoseVaccine(data.VACCINATION_DOSE),
        };
        setFormInitialValues(initialValuesFromDb);
      });
  };

  const fetchInitialDoseVaccine = async (dose) => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    const response = await fetch(`/vaccine/dose/${dose}`, {
      headers,
    });
    const data = await response.json();
    return data;
  };

  const fetchInitialTypeVaccination = async (type) => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    const response = await fetch(`/vaccine/type/initial/${type}`, {
      headers,
    });
    const data = await response.json();
    return data;
  };

  const fetchVaccineDoses = () => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/vaccine/dose`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setDoseVaccines(data);
      });
  };

  const fetchVaccineType = (vaccineTypeName) => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/vaccine/type/${vaccineTypeName}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setTypeVaccinations(data);
      });
  };

  const handleVaccineTypeSearch = (vaccineTypeName) => {
    fetchVaccineType(vaccineTypeName.query);
  };

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Úspešne pridané',
      detail: 'Vakcinácia úspešne pridaná.',
    });
  };

  const onSubmit = async (data, form) => {
    if (!patientId) {
      navigate('/patient');
      return;
    }

    const token = localStorage.getItem('logged-user');
    const requestOptionsPatient = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },

      body: JSON.stringify({
        vaccine_id: vaccineId || null,
        patient_id: patientId || null,
        type_vaccination: data.typeVaccination.VACCINE_ID,
        date_vaccination: data.dateVaccination,
        date_re_vaccination: data.dateReVaccination,
        dose_vaccine: data.doseVaccine,
      }),
    };

    await fetch(`/vaccine/insert/${patientId}`, requestOptionsPatient).then(
      () => {
        showSuccess();
        navigate('/patient/profile', { state: patientId });
      },
    );

    form.restart();
  };

  const validate = (data) => {
    let errors = {};
    // TODO errors
    /* if (!data.drugs || data.drugs.length === 0) {
      errors.drugs = 'Zadanie liekov je povinné.';
    }
    if (!data.date_expiry) {
      errors.date_expiry = 'Dátum expirácie je povinný.';
    }
    if (!data.selectedDiagnosis) {
      errors.selectedDiagnosis = 'Diagnóza je povinná.';
    } */
    return errors;
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <Form
        onSubmit={onSubmit}
        initialValues={formInitialValues}
        enableReinitialize={true}
        validate={validate}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="p-fluid">
            <Field
              name="dateVaccination"
              render={({ input, meta }) => (
                <div className="field col-12">
                  <span className="p-float-label">
                    <Calendar
                      id="dateVaccination"
                      {...input}
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="dateVaccination"
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Dátum vakcinácie*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            />
            <Field
              name="dateReVaccination"
              render={({ input, meta }) => (
                <div className="field col-12">
                  <span className="p-float-label">
                    <Calendar
                      id="dateReVaccination"
                      {...input}
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="dateReVaccination"
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Dátum re-vakcinácie*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            />
            <Field
              name="doseVaccine"
              render={({ input, meta }) => (
                <div className="field col-12">
                  <span className="p-float-label">
                    <Dropdown
                      {...input}
                      id="doseVaccine"
                      optionLabel="VACCINE_DOSE_TYPE"
                      optionValue="VACCINE_DOSE_ID"
                      value={input.value}
                      options={doseVaccines}
                      onChange={(e) => {
                        input.onChange(e.value);
                      }}
                      placeholder="Dávka vakcíny"
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="doseVaccine"
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    >
                      Dávka vakcíny*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            />
            <Field
              name="typeVaccination"
              render={({ input, meta }) => (
                <div className="field col-12">
                  <span className="p-float-label">
                    <AutoComplete
                      {...input}
                      id="typeVaccination"
                      value={input.value || ''}
                      suggestions={typeVaccinations}
                      completeMethod={(e) => handleVaccineTypeSearch(e)}
                      field="VACCINE_NAME"
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="typeVaccination"
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    >
                      Typ vakcíny*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        )}
      />
    </div>
  );
}
