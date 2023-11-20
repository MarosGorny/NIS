import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useLocation, useNavigate } from 'react-router';
import GetUserData from '../auth/get_user_data';

export default function MedicalRecordForm() {
  const [medicalProcedures, setMedicalProcedures] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [encodedImage, setEncodedImage] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [medicalRecordId, setMedicalRecordId] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState({
    notes: '',
    testResult: '',
    selectedMedicalProcedure: '',
    selectedDiagnosis: '',
  });
  const toast = useRef(null);
  const fileUploader = useRef(null);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) return;
    setPatientId(state.patientId);
    setMedicalRecordId(state.medicalRecordId);
  }, []);

  useEffect(() => {
    if (!medicalRecordId) return;
    fetchFormInitialValues();
  }, [medicalRecordId]);

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const fetchFormInitialValues = () => {
    if (!medicalRecordId) return;

    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/medicalRecord/${medicalRecordId}`, {
      headers,
    })
      .then((response) => response.json())
      .then(async (data) => {
        setMedicalRecordId(data.RECORD_ID);

        const initialValuesFromDb = {
          notes: data.NOTES,
          testResult: data.TEST_RESULT,
          selectedMedicalProcedure: await fetchInitialMedicalProcedure(
            data.SELECTED_MEDICAL_PROCEDURE,
          ),
          selectedDiagnosis: await fetchInitialDiagnoseCode(
            data.SELECTED_DIAGNOSIS,
          ),
        };
        setFormInitialValues(initialValuesFromDb);
      });
  };

  const fetchInitialDiagnoseCode = async (code) => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    const response = await fetch(`/diagnose/code/${code}`, { headers });
    const data = await response.json();
    return data;
  };

  const fetchInitialMedicalProcedure = async (code) => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    const response = await fetch(`/medicalProcedure/code/${code}`, { headers });
    const data = await response.json();
    return data;
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

  const fetchMedicalProcedures = (medicalProcedure) => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/medicalProcedure/${medicalProcedure}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setMedicalProcedures(data);
      });
  };

  const handleMedicalProcedureSearch = (medicalProcedure) => {
    fetchMedicalProcedures(medicalProcedure.query);
  };

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Úspešne pridané',
      detail: 'Predpis úspešne pridaný.',
    });
  };

  const encodeImage = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob());
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      // @ts-ignore
      setEncodedImage(reader.result.substring(reader.result.indexOf(',') + 1));
      setFileName(file.name);
      setMimeType(file.type);
    };
  };

  const onSubmit = async (data, form) => {
    if (!patientId) {
      navigate('/patient', { state: { errorPatientId: true } });
      return;
    }

    const token = localStorage.getItem('logged-user');
    const userData = GetUserData(token);
    const requestOptionsPatient = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },

      body: JSON.stringify({
        medical_record_id: medicalRecordId,
        notes: data.notes,
        test_result: data.testResult,
        medical_procedure: data.selectedMedicalProcedure.MEDICAL_PROCEDURE_CODE,
        diagnose: data.selectedDiagnosis.DIAGNOSE_CODE,
        patient_id: patientId,
        staff_id: userData.UserInfo.userid,
        image_data: encodedImage,
        file_name: fileName,
        mime_type: mimeType,
      }),
    };

    await fetch('/medicalRecord/insert', requestOptionsPatient).then(() => {
      showSuccess();
      navigate('/patient/profile', { state: patientId });
    });

    form.restart();
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {chooseButton}
        {cancelButton}
      </div>
    );
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
              name="notes"
              render={({ input, meta }) => (
                <div className="field col-12">
                  <span className="p-float-label">
                    <InputText
                      id="notes"
                      {...input}
                      autoFocus
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="notes"
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Poznámky
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            />
            <Field
              name="testResult"
              render={({ input, meta }) => (
                <div className="field col-12">
                  <span className="p-float-label">
                    <InputText
                      id="testResult"
                      {...input}
                      autoFocus
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="testResult"
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Výsledok testu
                    </label>
                  </span>
                  {getFormErrorMessage(meta)}
                </div>
              )}
            />
            <Field
              name="selectedMedicalProcedure"
              render={({ input, meta }) => (
                <div className="field col-12">
                  <span className="p-float-label">
                    <AutoComplete
                      {...input}
                      id="selectedMedicalProcedure"
                      value={input.value || ''}
                      suggestions={medicalProcedures}
                      completeMethod={(e) => handleMedicalProcedureSearch(e)}
                      field="NAME"
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    <label
                      htmlFor="selectedMedicalProcedure"
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    >
                      Lekársky zákrok*
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
            <div>
              <label htmlFor="basic">Príloha</label>
              <FileUpload
                ref={fileUploader}
                mode="advanced"
                accept="image/*"
                customUpload
                chooseLabel="Vložiť"
                cancelLabel="Zrušiť"
                headerTemplate={headerTemplate}
                maxFileSize={5000000000}
                onSelect={encodeImage}
                uploadHandler={encodeImage}
                emptyTemplate={
                  <p className="m-0">Drag and drop files to here to upload.</p>
                }
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        )}
      />
    </div>
  );
}
