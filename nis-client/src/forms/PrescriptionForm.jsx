import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useLocation, useNavigate } from 'react-router';
import GetUserData from '../auth/get_user_data';

export default function PrescriptionForm() {
  const [drugs, setDrugs] = useState([{ drugCode: '', dosage: 0 }]);
  const [prescriptionId, setPrescriptionId] = useState(0);
  const [patientId, setPatientId] = useState(0);
  const [diagnoses, setDiagnoses] = useState([]);
  const [drugCodes, setDrugCodes] = useState([]);
  const toast = useRef(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) return;
    setPrescriptionId(state.prescriptionId);
    setPatientId(state.patientId);
  }, []);

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const handleAddDrug = (event) => {
    event.preventDefault();
    setDrugs([...drugs, { drugCode: '', dosage: 0 }]);
  };

  const handleRemoveDrug = (event, index) => {
    event.preventDefault();
    const updateDrugs = [...drugs];
    updateDrugs.splice(index, 1);
    setDrugs(updateDrugs);
  };

  const fetchDiagnoses = (diagnoseName) => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/diagnose/${diagnoseName}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setDiagnoses(data);
      });
  };

  const handleDiagnosisSearch = (diagnoseName) => {
    fetchDiagnoses(diagnoseName.query);
  };

  const fetchDrugs = (drugName) => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/drug/${drugName}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setDrugCodes(data);
      });
  };

  const handleDrugsSearch = (drugName) => {
    fetchDrugs(drugName.query);
  };

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Úspešne pridané',
      detail: 'Predpis úspešne pridaný.',
    });
  };

  const onSubmit = async (data, form) => {
    const token = localStorage.getItem('logged-user');
    const userData = GetUserData(token);
    const requestOptionsPatient = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },

      body: JSON.stringify({
        drugs: data.drugs,
        staff_id: userData.UserInfo.userid,
        patient_id: patientId,
        diagnose: data.selectedDiagnosis.DIAGNOSE_CODE,
        date_expiry: data.date_expiry,
      }),
    };

    await fetch('/prescription/add', requestOptionsPatient).then(() => {
      showSuccess();
      navigate('/patient/profile', { state: patientId });
    });

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
    <div className="form prescription-form">
      <Toast ref={toast} />
      <Form
        onSubmit={onSubmit}
        initialValues={{
          drugs: drugs,
          date_expiry: '',
          selectedDiagnosis: '',
        }}
        validate={validate}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="p-fluid">
            <Field
              name={'date_expiry'}
              render={({ input, meta }) => (
                <div className="field col-12">
                  <span className="p-float-label">
                    <Calendar
                      {...input}
                      id={`date_expiry`}
                      showIcon
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor={`date_expiry`}
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    >
                      Dátum expirácie*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            />
            <Field
              name="selectedDiagnosis"
              render={({ input, meta }) => (
                <div className="field col-12">
                  <span className="p-float-label">
                    <AutoComplete
                      {...input}
                      id="selectedDiagnosis"
                      value={input.value || ''}
                      suggestions={diagnoses}
                      completeMethod={(e) => handleDiagnosisSearch(e)}
                      field="NAME"
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="selectedDiagnosis"
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    >
                      Diagnóza*
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            />
            {drugs.map((drug, index) => (
              <div className="precription-drugs-container" key={index}>
                <Field
                  name={`drugs[${index}].drugCode`}
                  render={({ input, meta }) => (
                    <div>
                      <span className="p-float-label">
                        <AutoComplete
                          {...input}
                          id={`drugCode_${index}`}
                          value={input.value || ''}
                          suggestions={drugCodes}
                          completeMethod={(e) => handleDrugsSearch(e)}
                          field="NAME"
                          className={classNames({
                            'p-invalid': isFormFieldValid(meta),
                          })}
                        />
                        <label
                          htmlFor={`drugCode_${index}`}
                          className={classNames({
                            'p-invalid': isFormFieldValid(meta),
                          })}
                        >
                          Liek*
                        </label>
                      </span>
                      {getFormErrorMessage(meta)}
                    </div>
                  )}
                />

                <Field
                  name={`drugs[${index}].dosage`}
                  render={({ input, meta }) => (
                    <div>
                      <span className="p-float-label">
                        <InputNumber
                          {...input}
                          id={`dosage_${index}`}
                          className={`p-inputtext ${
                            meta.error && meta.touched && 'p-invalid'
                          }`}
                          value={
                            isNaN(parseInt(input.value, 10))
                              ? null
                              : parseInt(input.value, 10)
                          }
                          onValueChange={(e) => input.onChange(e.value)}
                        />
                        <label
                          htmlFor={`dosage_${index}`}
                          className={
                            meta.error && meta.touched ? 'p-error' : ''
                          }
                        >
                          Dávkovanie (za deň)*
                        </label>
                      </span>
                      {meta.error && meta.touched && (
                        <small className="p-error">{meta.error}</small>
                      )}
                    </div>
                  )}
                />

                <Button
                  disabled={drugs.length === 1}
                  className="p-button-danger"
                  type="button"
                  onClick={(event) => handleRemoveDrug(event, index)}
                >
                  Remove drug
                </Button>
              </div>
            ))}

            <Button type="button" onClick={(event) => handleAddDrug(event)}>
              Add Drug
            </Button>

            <Button type="submit" label="Odoslať" />
          </form>
        )}
      />
    </div>
  );
}
