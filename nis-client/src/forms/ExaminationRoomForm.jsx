import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import GetUserData from '../auth/get_user_data';
import {useLocation, useNavigate} from 'react-router';
import { Dialog } from 'primereact/dialog'
import { Link } from 'react-router-dom';

export default function ExaminationRoomForm() {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [nurses, setNurses] = useState([]);
    const [filteredDepartmentLocationCode, setFilteredDepartmentLocationCode] = useState(null);
    const [filteredDoctorID, setFilteredDoctorID] = useState(null);
    const [filteredNurseID, setFilteredNurseID] = useState(null);
    const toast = useRef(null);
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [items, setItems] = useState([
        { id: 1, name: '', quantity: 10 },
    ]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedNurse, setSelectedNurse] = useState(null);

    const [examinationRoomNumber, setExaminationRoomNumber] = useState(null);
    const { state } = useLocation();
    const [formInitialValues, setFormInitialValues] = useState({

        examinationRoomNumber: '',
        nameExaminationRoom: '',
        department: '',
        doctorID: '',
        nurseID: '',

    });
    const [isFetchingData, setIsFetchingData] = useState(false);





    useEffect(() => {
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token };
        fetch(`/department/hospital/${tokenParsedData.UserInfo.hospital}`, {
            headers,
        })
            .then((response) => response.json())
            .then((res) => {
                let array = [];
                array = res.map((item) => item);
                setDepartments(array);
            });
    }, []); // eslint-disable-line;


    useEffect(() => {
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token };
        fetch(`/staff/doctors/hospital/${tokenParsedData.UserInfo.hospital}`, {
            headers,
        })
            .then((response) => response.json())
            .then((res) => {
                let array = [];
                array = res.map((item) => item);
                setDoctors(array);
            });
    }, []); // eslint-disable-line;

    useEffect(() => {
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token };
        fetch(`/staff/nurses/hospital/${tokenParsedData.UserInfo.hospital}`, {
            headers,
        })
            .then((response) => response.json())
            .then((res) => {

                let array = [];
                array = res.map((item) => item);
                setNurses(array);
            });
    }, []); // eslint-disable-line;

    useEffect(() => {

    }, [nurses]);
    const searchDepartmentLocationCode = (event) => {

        setTimeout(() => {
            let _filteredDepartmentLocationCode;
            if (!event.query.trim().length) {
                _filteredDepartmentLocationCode = [...departments];
            } else {
                _filteredDepartmentLocationCode = departments.filter((department) => {
                    const name = String(department.NAME);
                    const locationCode = String(department.DEPARTMENT_LOCATION_CODE);

                    const fullName = `${name} - ${locationCode}`;

                    // Check if the concatenated string starts with the query (case-insensitive)
                    return fullName.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredDepartmentLocationCode(_filteredDepartmentLocationCode);
        }, 250);
    };

    const searchDoctorID = (event) => {
        setTimeout(() => {
            let _filteredDoctorID;
            if (!event.query.trim().length) {
                _filteredDoctorID = [...doctors];
            } else {
                _filteredDoctorID = doctors.filter((doctor) => {
                    const nameSurname = String(doctor.NAMESURNAME);
                    const doctor_id = Number(doctor.STAFF_ID);
                    const speciality = String(doctor.NAME);

                    const fullName = `${nameSurname} - ${speciality}- ${doctor_id}`;

                    // Check if the concatenated string starts with the query (case-insensitive)
                    return fullName.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredDoctorID(_filteredDoctorID);
        }, 250);
    };

    const searchNurseID = (event) => {
        setTimeout(() => {
            let _filteredNurseID;
            if (!event.query.trim().length) {
                _filteredNurseID = [...nurses];
            } else {
                _filteredNurseID = nurses.filter((nurse) => {
                    const nameSurname = String(nurse.NAMESURNAME);
                    const nurse_id = Number(nurse.STAFF_ID);
                    const speciality = String(nurse.NAME);

                    const fullName = `${nameSurname} - ${speciality}- ${nurse_id}`;
                    // Check if the concatenated string starts with the query (case-insensitive)
                    return fullName.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            setFilteredNurseID( _filteredNurseID);
        }, 100);
    };

    useEffect(() => {
        if (!state) return;
        setExaminationRoomNumber(state.examinationRoomNumber);
    }, []);

    useEffect(() => {
        if (!examinationRoomNumber) return;
        fetchFormInitialValues();
    }, [examinationRoomNumber]);

    // Add the following useEffect block to observe changes in formInitialValues
    useEffect(() => {
        setSelectedDepartment(formInitialValues.department);
        setSelectedNurse(String(formInitialValues.nurseID));
        setSelectedDoctor(String(formInitialValues.doctorID));
    }, [formInitialValues]);
    const fetchFormInitialValues = () => {
        if (!examinationRoomNumber) return;

        const token = localStorage.getItem('logged-user');
        const headers = { authorization: 'Bearer ' + token };
        fetch(`/examination/formData/${examinationRoomNumber}`, {
            headers,
        })
            .then((response) => response.json())
            .then(async (data) => {

                const initialValuesFromDb = {
                        examinationRoomNumber: data.EXAMINATION_LOCATION_CODE,
                        nameExaminationRoom: data.NAME_ROOM,
                        department: data.DEPARTMENT_LOCATION_CODE,
                        doctorID: data.DOCTOR_ID,
                        nurseID: data.NURSE_ID,
                };
                setFormInitialValues(initialValuesFromDb)
                setIsFetchingData(true);
            });
    };

    const validate = (data) => {
        let errors = {};

        if (!data.examinationRoomNumber) {
            errors.examinationRoomNumber = 'Číslo ambulancie je povinné';
        }
        if (!data.nameExaminationRoom) {
            errors.nameExaminationRoom = 'Meno ambulancie je povinné';
        }
        if (!data.department) {
            errors.department = 'Odelenie pre ambulanciu je povinné';
        }
        if (!data.doctorID) {
            errors.doctorID = 'ID pre lekára je povinné';
        }
        if (!data.nurseID) {
            errors.nurseID = 'ID pre sestričku je povinné';
        }

        return errors;
    };

    const showError = () => {
        toast.current.show({
            severity: 'error',
            summary: 'Ambulancia ju sa nepodarilo pridať',
            detail: 'Ambulanciu sa nepodarilo pridať, kvoli zlým údajom',
            life: 3000,
        });
    };

    const addExaminationRooom = async (data, form) => {
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token,'Content-Type': 'application/json' };
        const body =JSON.stringify({
            examinationRoomNumber: data.examinationRoomNumber,
            nameExaminationRoom: data.nameExaminationRoom,
            department: data.department,
            doctorID: data.doctorID,
            nurseID: data.nurseID,
        });

        fetch(`/examination/new-room`, {
            method: 'POST',
            headers, body
        }).then((response) => {
            // Success handling code

            if (!response.ok) {
                showError();
                form.restart();
                setTimeout(() => {
                    navigate('/examination-room', { state: 'examination_room_added' });
                }, 3000);
            } else {
                showSuccess();
                form.restart();
                setTimeout(() => {
                    navigate('/examination-room', { state: 'examination_room_added' });
                }, 3000);
            }

        }).catch((error) => {
            console.error('Fetch error:', error);
            showError();
            form.restart();
            // Other error handling logic
        });


    };

    const addExaminationRooomWithSupplies = async (data, form) => {
        // Filter the items array to get only the necessary properties and convert it to an object
        const items_as_one = items.reduce((acc, { name, quantity }) => {
            acc[name] = quantity;
            return acc;
        }, {});
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token,'Content-Type': 'application/json' };
       const jsonString = JSON.stringify(items_as_one);
        const body =JSON.stringify({
            examinationRoomNumber: data.examinationRoomNumber,
            nameExaminationRoom: data.nameExaminationRoom,
            department: data.department,
            doctorID: data.doctorID,
            nurseID: data.nurseID,
            supplies:jsonString
        });

        fetch(`/examination/new-room-supplies`, {
            method: 'POST',
            headers,
            body
        }).then((response) => {
            // Success handling code

            if (!response.ok) {
                showError();
                form.restart();
                setTimeout(() => {
                    navigate('/examination-room', { state: 'examination_room_added' });
                }, 3000);
            } else {
                showSuccess();
                form.restart();
                setTimeout(() => {
                    navigate('/examination-room', { state: 'examination_room_added' });
                }, 3000);
            }

        }).catch((error) => {
            console.error('Fetch error:', error);
            showError();
            form.restart();
            // Other error handling logic
        });
    };

    const updateExaminationRooom = async (data, form) => {
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token,'Content-Type': 'application/json' };
        const body =JSON.stringify({
            examinationRoomNumber: data.examinationRoomNumber,
            nameExaminationRoom: data.nameExaminationRoom,
            department: data.department,
            doctorID: data.doctorID,
            nurseID: data.nurseID,
        });
        fetch(`/examination/update`, {
            method: 'POST',
            headers, body
        }).then((response) => {
            // Success handling code

            if (!response.ok) {
                showEditError();
                form.restart();
                setTimeout(() => {
                    navigate('/examination-room', { state: 'examination_room_added' });
                }, 3000);
            } else {
                showEditSuccess();
                form.restart();
                setTimeout(() => {
                    navigate('/examination-room', { state: 'examination_room_added' });
                }, 3000);
            }

        }).catch((error) => {
            console.error('Fetch error:', error);
            showError();
            form.restart();
            // Other error handling logic
        });


    };




    const onSubmit = async (data, form) => {
        if (examinationRoomNumber !== null) {
            // The examinationRoomNumber is not an empty string
            updateExaminationRooom(data,form);
        }
        else {
            if (items[0].name == ''){
                addExaminationRooom(data,form);
            }
            else {
                addExaminationRooomWithSupplies(data,form);
            }


        }



    };

    const showEditSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Úspešne upravená',
            detail: 'Ambulancia  bola úspešne upravená',
            life: 3000,
        });
    };

    const showEditError = () => {
        toast.current.show({
            severity: 'error',
            summary: 'Ambulancia sa nepodarilo upraviť',
            life: 3000,
        });
    };





    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return (
            isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
        );
    };



    const showSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Úspešne pridaná',
            detail: 'Ambulancia  bola úspešne pridana',
            life: 3000,
        });
    };




// Funkcie na ovládanie dialógového okna
    const openDialog = () => setShowDialog(true);
    const closeDialog = () => {
        setShowDialog(false);
    }


    // Funkcia na úpravu položiek
    const updateItem = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
    };

    // Funkcia na pridávanie nových položiek
    const addNewItem = () => {
        const newItem = { id: items.length + 1, name: '', quantity: 0 };
        setItems([...items, newItem]);
    };



    return (
        <div
            style={{ width: '100%', marginTop: '2rem' }}
            className="p-fluid grid formgrid"
        >
            <Toast ref={toast} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Link to="/examination-room/">
                <Button type="button" label="Späť" icon="pi pi-arrow-left" />
                </Link>
                <h1 style={{ textAlign: 'center', flex: 1 }}>Pridanie novej ambulancie</h1>
            </div>
            <div className="flex flex-column gap-2">
                <Form
                    onSubmit={onSubmit}
                    initialValues={formInitialValues}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                                <Field
                                    name="examinationRoomNumber"
                                    render={({ input, meta }) => (
                                        <div className="field col-12">
                                            <label
                                                htmlFor="examinationRoomNumber"
                                                className={classNames({
                                                    'p-error': isFormFieldValid(meta),
                                                })}
                                            >
                                                Číslo ambulancie
                                            </label>
                                          <InputText
                                              id="examinationRoomNumber"
                                              {...input}
                                              autoFocus
                                              className={classNames({
                                                  'p-invalid': isFormFieldValid(meta),
                                              })}
                                          />


                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                        name="nameExaminationRoom"
                                        render={({ input, meta }) => (
                                            <div className="field col-12">
                                                <label
                                                    htmlFor="nameExaminationRoom"
                                                    className={classNames({
                                                        'p-error': isFormFieldValid(meta),
                                                    })}
                                                >
                                                    Názov ambulancie
                                                </label>
                                                  <InputText
                                                      id="nameExaminationRoom"
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
                                name="department"
                                render={({ input, meta }) => (
                                    <div className="field col-12">
                                        <label
                                            htmlFor="department"
                                            className={classNames({
                                                'p-error': isFormFieldValid(meta),
                                            })}
                                        >
                                            Oddelenie*
                                        </label>
                                        <AutoComplete
                                            id="department"
                                            defaultValue={selectedDepartment}
                                            suggestions={filteredDepartmentLocationCode}
                                            completeMethod={searchDepartmentLocationCode}
                                            field="department"
                                            className={classNames({
                                                'p-invalid': isFormFieldValid(meta),
                                            })}
                                            itemTemplate={(item) => (
                                                <div>
                                                    {item.NAME} - {item.DEPARTMENT_LOCATION_CODE}
                                                </div>
                                            )}
                                            selectedItemTemplate={(item) => (
                                                <div>
                                                    {item.NAME} - {item.DEPARTMENT_LOCATION_CODE}
                                                </div>
                                            )}
                                            onChange={(e) => {
                                                const selectedValue = e.value ? `${e.value.NAME} - ${e.value.DEPARTMENT_LOCATION_CODE}` : '';

                                                input.onChange(selectedValue);

                                                setSelectedDepartment(e.value);
                                                if (typeof e.value === 'object' && e.value !== null) {
                                                    // Split the string by hyphen
                                                    const parts = selectedValue.split('-');

                                                    // Get the second part and trim any extra whitespace
                                                    const extractedValue = parts[1] ? parts[1].trim() : null;

                                                    input.onChange(extractedValue);
                                                    setSelectedDepartment(extractedValue);


                                                }
                                            }}
                                            value={selectedDepartment}
                                        />

                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="doctorID"
                                render={({ input, meta }) => (
                                    <div className="field col-12">
                                        <label
                                            htmlFor="doctorID"
                                            className={classNames({
                                                'p-error': isFormFieldValid(meta),
                                            })}
                                        >
                                            Lekar
                                        </label>
                                        <AutoComplete

                                            id="doctorID"
                                            suggestions={filteredDoctorID}
                                            completeMethod={searchDoctorID}
                                            field="doctorID"
                                            className={classNames({
                                                'p-invalid': isFormFieldValid(meta),
                                            })}
                                            itemTemplate={(item) => (
                                                <div>
                                                    {item.NAMESURNAME} - {item.NAME} -{item.STAFF_ID}
                                                </div>
                                            )}
                                            selectedItemTemplate={(item) => (
                                                <div>
                                                    {item.NAMESURNAME} - {item.NAME} -{item.STAFF_ID}
                                                </div>
                                            )}

                                            onChange={(e) => {
                                                const selectedValue = e.value ? `${e.value.NAMESURNAME} - ${e.value.NAME} - ${e.value.STAFF_ID}` : '';
                                                input.onChange(selectedValue);

                                                setSelectedDoctor(e.value);

                                                if (typeof e.value === 'object' && e.value !== null) {
                                                    setSelectedDoctor(selectedValue);
                                                    setSelectedDoctor(e.value.STAFF_ID);
                                                    // Use a regular expression to extract the numeric part
                                                    const match = selectedValue.match(/\b\d+\b/);

                                                    // Check if a match is found
                                                    const extractedNumber = match ? match[0] : null;
                                                    input.onChange(extractedNumber);
                                                    // Output: 500492
                                                    setSelectedDoctor(extractedNumber);




                                                }


                                            }}
                                            value={selectedDoctor}

                                        />

                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />



                            <Field
                                name="nurseID"
                                render={({ input, meta }) => (
                                    <div className="field col-12">
                                        <label
                                            htmlFor="nurseID"
                                            className={classNames({
                                                'p-error': isFormFieldValid(meta),
                                            })}
                                        >
                                            Sestra
                                        </label>
                                        <AutoComplete

                                            id="nurseID"
                                            suggestions={filteredNurseID}
                                            completeMethod={searchNurseID}
                                            field="STAFF_ID"
                                            className={classNames({
                                                'p-invalid': isFormFieldValid(meta),
                                            })}
                                            itemTemplate={(item) => (
                                                <div>
                                                    {item.NAMESURNAME} - {item.NAME} -{item.STAFF_ID}
                                                </div>
                                            )}
                                            selectedItemTemplate={(item) => (
                                                <div>
                                                    {item.NAMESURNAME} - {item.NAME} -{item.STAFF_ID}
                                                </div>
                                            )}

                                            onChange={(e) => {
                                                const selectedValue = e.value ? `${e.value.NAMESURNAME} - ${e.value.NAME} - ${e.value.STAFF_ID}` : '';
                                                input.onChange(selectedValue);
                                                setSelectedNurse(e.value);
                                                if (typeof e.value === 'object' && e.value !== null) {
                                                    // Use a regular expression to extract the numeric part
                                                    const match = selectedValue.match(/\b\d+\b/);

                                                    // Check if a match is found
                                                    const extractedNumber = match ? match[0] : null;
                                                    input.onChange(extractedNumber);
                                                    setSelectedNurse(extractedNumber);




                                                }


                                            }}
                                            value={selectedNurse}
                                        />

                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />




                            <div
                                className="field col-12 "
                                style={{ justifyContent: 'center', display: 'grid' }}
                            >
                                {!isFetchingData && (
                                    <Button type="button" label="Pridať zdravotné potreby" icon="pi pi-plus" onClick={openDialog}/>
                                )}
                            </div>

                                {/* Dialógové okno */}
                                <Dialog header="Dáta" visible={showDialog} style={{ width: '80vw' }} onHide={closeDialog}>
                                    <div className="flex flex-column gap-2">
                                        {items.map(item => (
                                            <div key={item.id} className="p-col-6 p-md-6">
                                                <div className="p-field">
                                                    <label htmlFor="name">Názov</label>
                                                        <InputText
                                                            value={item.name}
                                                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                        />

                                                </div>
                                                <div className="p-field">
                                                    <label htmlFor="name">Množstvo</label>
                                                        <InputText
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                                            type="number"
                                                        />



                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button label="Pridať Novú Položku" onClick={addNewItem} />
                                    <Button label="Ulozit" onClick={closeDialog} />
                                </Dialog>

                                <div
                                    className="field col-12 "
                                    style={{ justifyContent: 'center', display: 'grid' }}
                                >


                                    <Button
                                        type="submit"
                                        style={{ width: '50vh' }}
                                        className="p-button-lg"
                                        label="Odoslať"
                                        icon="pi pi-check"
                                        iconPos="right"
                                    />
                                </div>

                        </form>


                    )}
                />
            </div>
        </div>
    );
}