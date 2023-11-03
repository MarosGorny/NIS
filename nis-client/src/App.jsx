import React from 'react';
import { Route, Routes } from 'react-router';
import './App.scss';
import { Login } from './auth/login/Login';
import Logout from './auth/logout/Logout';
import PatientsTable from 'tables/PatientsTable';

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
      </Routes>
    </div>
  );
}

export default App;
