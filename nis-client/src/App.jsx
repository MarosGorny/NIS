import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router';
import './App.scss';
import { Login } from './auth/login/Login';
import Logout from './auth/logout/Logout';
import PatientsTable from 'tables/PatientsTable';
import PatientForm from 'forms/PatientForm';

import ExaminationRoomTable from "./tables/ExaminationRoomTable";
import ExaminationRoomForm from "./forms/ExaminationRoomForm";


import PrescriptionForm from 'forms/PrescriptionForm';
import PatientProfile from 'pages/PatientProfile';
import Dashboard from 'pages/Dashboard';
import MedicalRecordForm from 'forms/MedicalRecordForm';
import VaccineForm from 'forms/VaccineForm';
import { Button } from 'primereact/button';
import { Register } from 'auth/register/Register';
import AppointmentForm from 'forms/AppointmentForm';


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('logged-user');
    setIsLoggedIn(token ? true : false);
  }, [isLoggedIn]);

  return (
    <div id="App" className="App">
      <aside
        className="sidebar"
        style={{
          width:
            location.pathname === '/login' || location.pathname === '/register'
              ? '0'
              : '60px',
          backgroundColor: 'var(--primary-color)',
        }}
      >
        <Button
          className={`sidebar-button ${location.pathname === '/' ? 'sidebar-button-selected' : ''
            }`}
          icon="pi pi-home"
          onClick={() => navigate('/')}
        />
        <Button
          className={`sidebar-button ${location.pathname.startsWith('/patient') ||
              location.pathname.startsWith('/vaccine') ||
              location.pathname.startsWith('/prescription') ||
              location.pathname.startsWith('/medicalRecord')
              ? 'sidebar-button-selected'
              : ''
            }`}
          icon="pi pi-user"
          onClick={() => navigate('/patient')}
        />
        <Button icon="pi pi-table" onClick={() => navigate('/examination-room')} />
        <Button icon="pi pi-sign-out" onClick={() => navigate('/logout')} />
      </aside>
      <div
        id="app-route-content"
        style={{
          width:
            location.pathname === '/login' || location.pathname === '/register'
              ? '100%'
              : 'calc(100% - 60px)',
          marginLeft:
            location.pathname === '/login' || location.pathname === '/register'
              ? '0'
              : '60px',
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<Dashboard isLoggedIn={isLoggedIn}></Dashboard>}
          ></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/logout" element={<Logout></Logout>}></Route>
          <Route
            path="/patient"
            element={<PatientsTable></PatientsTable>}
          ></Route>
          <Route
            path="/examination-room"
            element={<ExaminationRoomTable></ExaminationRoomTable>}
          ></Route>
          <Route
            path="/examination-room/form"
            element={<ExaminationRoomForm></ExaminationRoomForm>}
          ></Route>
          <Route
            path="/patient/form"
            element={<PatientForm></PatientForm>}
          ></Route>
          <Route
            path="/patient/profile"
            element={<PatientProfile></PatientProfile>}
          ></Route>
          <Route
            path="/prescription/form"
            element={<PrescriptionForm></PrescriptionForm>}
          ></Route>
          <Route
            path="/medicalRecord/form"
            element={<MedicalRecordForm></MedicalRecordForm>}
          ></Route>
          <Route
            path="/appointment-form"
            element={<AppointmentForm />}
          ></Route>/
          <Route
            path="/vaccine/form"
            element={<VaccineForm></VaccineForm>}
          ></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
