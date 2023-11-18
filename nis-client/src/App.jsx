import React from 'react';
import { Route, Routes } from 'react-router';
import './App.scss';
import { Login } from './auth/login/Login';
import Logout from './auth/logout/Logout';
import PatientsTable from 'tables/PatientsTable';
import PatientForm from 'forms/PatientForm';
import PrescriptionForm from 'forms/PrescriptionForm';
import PatientProfile from 'components/PatientProfile';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/logout" element={<Logout></Logout>}></Route>
        <Route
          path="/patient"
          element={<PatientsTable></PatientsTable>}
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
      </Routes>
    </div>
  );
}

export default App;
