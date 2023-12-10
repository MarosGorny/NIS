import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import AppointmentForm from 'forms/AppointmentForm';
import { Link } from 'react-router-dom';
import GetUserData from 'auth/get_user_data';

export default function PatientAppointmentsTable(props) {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [appointments, setAppointments] = useState(null);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false); // State to toggle the form

    // const handleAddNewAppointmentClick = () => {
    //     navigate('/appointment-form'); // Navigate to the route where the AppointmentForm is rendered
    // };

    useEffect(() => {
        fetchPatientAppointments();
    }, []);

    const fetchPatientAppointments = () => {
        const token = localStorage.getItem('logged-user');
        const headers = { 'Authorization': `Bearer ${token}` };
        const patientId = props?.patientId || GetUserData(token).UserInfo.patientId;

        fetch(`/appointment/patient/${patientId}`, { headers })
            .then(response => response.json())
            .then(data => {
                setAppointments(data);
            })
            .catch(error => console.error('Error fetching patient appointments:', error));
    };

    const onAppointmentSelect = (appointment) => {
        // Placeholder for navigating to appointment details
    };

    const deleteAppointment = (appointmentId) => {
        // Placeholder function to delete an appointment
    };

    const renderExaminationTypeBodyTemplate = (rowData) => {
        return <span>{rowData.examinationType}</span>;
    };

    const renderMedicalProcedureBodyTemplate = (rowData) => {
        return <span>{rowData.medicalProcedure}</span>;
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
    
        // Format the date part
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
    
        // Format the time part
        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    
        return `${formattedDate} | ${formattedTime}`;
    };
    
    const renderDateBodyTemplate = (rowData) => {
        return <span>{formatDateTime(rowData.DATE_EXAMINATION)}</span>;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };



    const renderActionsBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => onAppointmentSelect(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => deleteAppointment(rowData.appointmentId)} />
            </React.Fragment>
        );
    };

    const renderHeader = () => {
        return (
            <div className="table-header">
                <span>Stretnutia</span>
                <div className="table-header-right">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            onChange={(e) => setGlobalFilterValue(e.target.value)} placeholder="Vyhľadať..." />
                    </span>
                    <Link
                        to="/appointment-form"
                        state={{
                            patientId: props?.patientId ? props.patientId : null,
                        }}
                    >
                        <Button
                            type="button"
                            icon="pi pi-plus"
                            className="p-button-secondary"
                        />
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            {showAppointmentForm ? (
                // Conditionally render the AppointmentForm if showAppointmentForm is true
                <AppointmentForm />
            ) : (
                <DataTable value={appointments} header={renderHeader()} responsiveLayout="scroll"
                    dataKey="appointmentId" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Zobrazených {first} až {last} z {totalRecords} stretnutí"
                    globalFilter={globalFilterValue} emptyMessage="Nenašli sa žiadne stretnutia."
                    selectionMode="single" onSelectionChange={(e) => onAppointmentSelect(e.value)}
                >
                      <Column field="DATE_EXAMINATION" header="Dátum a čas" body={renderDateBodyTemplate} sortable filter filterPlaceholder="Hľadanie podľa dátumu a času" />
                    <Column field="Ambulancia" header="Ambulancia" sortable filter filterPlaceholder="Hľadanie podľa ambulancie" />
                    <Column field="AmbulanciaKod" header="Kód ambulancie" sortable filter filterPlaceholder="Hľadanie podľa kódu ambulancie" />
                    <Column field="TypVesetrenia" header="Typ vyšetrenia" sortable filter filterPlaceholder="Hľadanie podľa typu vyšetrenia" />
                    {/* <Column field="LekarskyZakrok" header="Lekársky zákrok" sortable filter filterPlaceholder="Hľadanie podľa zákroku" /> */}

                </DataTable>
            )}
        </div>
    );
}
