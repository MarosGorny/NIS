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
import { Dropdown } from 'primereact/dropdown';

export default function PatientAppointmentsTable(props) {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [appointments, setAppointments] = useState(null);
    const toast = useRef(null);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false); // State to toggle the form
    const [selectedAppointmentType, setSelectedAppointmentType] = useState('all');

    const loadAppointmentsByType = () => {
        // Implement the logic to load appointments based on selectedAppointmentType
        // Use SQL queries in the model to filter data
    };

    const onAppointmentTypeChange = (e) => {
        setSelectedAppointmentType(e.value);
    };

    const fetchPatientAppointments = () => {
        const token = localStorage.getItem('logged-user');
        const headers = { 'Authorization': `Bearer ${token}` };
        const patientId = props?.patientId || GetUserData(token).UserInfo.patientId;

        let endpoint = `/appointment/patient/${patientId}`;
        if (selectedAppointmentType === 'planovane') {
            endpoint = `/appointment/patient/future/${patientId}`;
        } else if (selectedAppointmentType === 'historia') {
            endpoint = `/appointment/patient/historical/${patientId}`;
        }

        fetch(endpoint, { headers })
            .then(response => response.json())
            .then(data => setAppointments(data))
            .catch(error => console.error('Error fetching patient appointments:', error));
    };

    const appointmentTypeSelectItems = [
        { label: 'Všetky Stretnutia', value: 'vsetky' },
        { label: 'Plánované Stretnutia', value: 'planovane' },
        { label: 'História Stretnutí', value: 'historia' },
        // ... any other types ...
    ];

    useEffect(() => {
        fetchPatientAppointments();
    }, [selectedAppointmentType]); 



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

    const renderHeader = () => {
        return (
            <div className="table-header">
                <span>Stretnutia</span>
                <div className="table-header-right">
                <Dropdown
                        value={selectedAppointmentType}
                        options={[
                            { label: 'Všetky Stretnutia', value: 'all' },
                            { label: 'Plánované Stretnutia', value: 'planovane' },
                            { label: 'História Stretnutí', value: 'historia' },
                        ]}
                        onChange={onAppointmentTypeChange}
                        placeholder="Vyberte Typ Stretnutia"
                    />
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
                    selectionMode="single"
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
