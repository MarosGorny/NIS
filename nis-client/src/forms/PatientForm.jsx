// @ts-nocheck
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import GetUserData from '../auth/get_user_data';
import { useLocation, useNavigate } from 'react-router';
export default function PatientForm(props) {
  const [municipalities, setMunicipalities] = useState([]);
  const [filteredPostalCode, setFilteredPostalCode] = useState(null);
  const [patientId, setPatientId] = useState(0);
  const [formInitialValues, setFormInitialValues] = useState({
    birth_number: '',
    email: '',
    name: '',
    surname: '',
    postal_code: '',
    address: '',
    date_from: new Date(),
  });
  const toast = useRef(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch('/municipality', { headers })
      .then((response) => response.json())
      .then((res) => {
        let array = [];
        array = res.map((item) => item);
        setMunicipalities(array);
      });
  }, []); // eslint-disable-line;

  useEffect(() => {
    if (!state) return;
    setPatientId(state.patientId);
  }, []);

  useEffect(() => {
    if (!patientId) return;
    fetchFormInitialValues();
  }, [patientId]);

  const fetchFormInitialValues = () => {
    if (!patientId) return;

    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/patient/formData/${patientId}`, {
      headers,
    })
      .then((response) => response.json())
      .then(async (data) => {

        const initialValuesFromDb = {
          birth_number: data.BIRTH_NUMBER,
          email: data.EMAIL,
          name: data.NAME,
          surname: data.SURNAME,
          postal_code: data.POSTAL_CODE,
          address: data.ADDRESS,
          date_from: new Date(data.DATE_FROM),
        };
        setFormInitialValues(initialValuesFromDb);
      });
  };

  const validate = (data) => {
    let errors = {};

    if (!data.name) {
      errors.name = 'Meno je povinné';
    }
    if (!data.surname) {
      errors.surname = 'Priezvisko je povinné';
    }
    if (!data.birth_number) {
      errors.birth_number = 'Rodné číslo je povinné';
    }
    if (!data.postal_code) {
      errors.postal_code = 'PSČ je povinné';
    }
    if (!data.address) {
      errors.address = 'Ulica je povinná';
    }
    if (!data.email) {
      errors.email = 'Email je povinný';
    }
    if (!data.date_from) {
      errors.date_from = 'Dátum zápisu je povinný';
    }
    return errors;
  };

  const onSubmit = async (data, form) => {
    const token = localStorage.getItem('logged-user');
    const userData = GetUserData(token);
    const endpoint = patientId ? '/patient/update' : '/patient/add'; // Determine endpoint

    const requestOptionsPatient = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
            patient_id: patientId || null,
            birth_number: data.birth_number,
            name: data.name,
            email: data.email,
            surname: data.surname,
            postal_code: data.postal_code,
            hospital_id: userData.UserInfo.hospital,
            address: data.address,
            date_from: data.date_from.toLocaleString('en-GB').replace(',', ''),
        }),
    };

    await fetch(endpoint, requestOptionsPatient).then(() => {
        showSuccess();
        navigate('/patient', { state: patientId ? 'patient_updated' : 'patient_added' });
    });

    form.restart();
  };


  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const searchPostalCode = (event) => {
    setTimeout(() => {
      let _filteredPostalCode;
      if (!event.query.trim().length) {
        _filteredPostalCode = [...municipalities];
      } else {
        _filteredPostalCode = municipalities.filter((municipality) => {
          return municipality.MUNICIPALITY_NAME.toLowerCase().startsWith(
            event.query.toLowerCase(),
          );
        });
      }

      setFilteredPostalCode(_filteredPostalCode);
    }, 250);
  };

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Úspešne pridané',
      detail: 'Pacient bol úspešne pridaný',
    });
  };

  return (
    <div className="form">
      <Toast ref={toast} />

      <div className="field col-12">
        <Form
          onSubmit={onSubmit}
          initialValues={formInitialValues}
          validate={validate}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
              <Field
                name="name"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <span className="p-float-label">
                      <InputText
                        id="name"
                        {...input}
                        className={classNames({
                          'p-invalid': isFormFieldValid(meta),
                        })}
                      />
                      <label
                        htmlFor="name"
                        className={classNames({
                          'p-error': isFormFieldValid(meta),
                        })}
                      >
                        Meno*
                      </label>
                    </span>
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name="surname"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <span className="p-float-label ">
                      <InputText
                        id="surname"
                        {...input}
                        className={classNames({
                          'p-invalid': isFormFieldValid(meta),
                        })}
                      />
                      <label
                        htmlFor="surname"
                        className={classNames({
                          'p-error': isFormFieldValid(meta),
                        })}
                      >
                        Priezvisko*
                      </label>
                    </span>
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name="birth_number"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <span className="p-float-label">
                      <InputMask
                        id="birth_number"
                        mask="999999/9999"
                        {...input}
                        className={classNames({
                          'p-invalid': isFormFieldValid(meta),
                        })}
                      />
                      <label
                        htmlFor="birth_number"
                        className={classNames({
                          'p-error': isFormFieldValid(meta),
                        })}
                      >
                        Rodné číslo*
                      </label>
                    </span>
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name="postal_code"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <span className="p-float-label">
                      <AutoComplete
                        {...input}
                        suggestions={filteredPostalCode}
                        completeMethod={searchPostalCode}
                        field="MUNICIPALITY_NAME"
                        className={classNames({
                          'p-invalid': isFormFieldValid(meta),
                        })}
                      />

                      <label
                        htmlFor="postal_code"
                        className={classNames({
                          'p-error': isFormFieldValid(meta),
                        })}
                      >
                        PSČ*
                      </label>
                    </span>
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name="email"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <span className="p-float-label">
                      <InputText
                        id="email"
                        {...input}
                        autoFocus
                        className={classNames({
                          'p-invalid': isFormFieldValid(meta),
                        })}
                      />
                      <label
                        htmlFor="email"
                        className={classNames({
                          'p-error': isFormFieldValid(meta),
                        })}
                      >
                        Email*
                      </label>
                    </span>
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name="address"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label
                      htmlFor="address"
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Ulica
                    </label>
                    <InputText
                      id="address"
                      {...input}
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name="date_from"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label
                      htmlFor="date_from"
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Dátum zápisu pacienta*
                    </label>
                    <Calendar
                      id="basic"
                      {...input}
                      dateFormat="dd. mm. yy"
                      mask="99.99.9999"
                      showIcon
                      showTime
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />

              <Button type="submit" label="Odoslať" />
            </form>
          )}
        />
      </div>
    </div>
  );
}
