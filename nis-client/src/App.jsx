import React from 'react';
import { Route, Routes } from 'react-router';
import './App.scss';
import { Login } from './auth/login/Login';
import Logout from './auth/logout/Logout';
import PatientsTable from 'tables/PatientsTable';
import PatientForm from 'forms/PatientForm';
import ExaminationRoomTable from "./tables/ExaminationRoomTable";
import ExaminationRoomForm from "./forms/ExaminationRoomForm";


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
            path="/examination-room"
            element={<ExaminationRoomTable></ExaminationRoomTable>}
        ></Route>
        <Route
            path="/examination-room/form"
            element={<ExaminationRoomForm></ExaminationRoomForm>}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
