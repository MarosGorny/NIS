// @ts-nocheck
import BloodDonationTypes from 'charts/BloodDonationTypes';
import DashboardNumberCard from 'components/DashboardNumberCard';
import { AutoComplete } from 'primereact/autocomplete';
import { Card } from 'primereact/card';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Top10BloodDonationsTable from 'tables/Top10BloodDonationsTable';
import { Calendar } from 'primereact/calendar';
import HospitalSpaceTable from 'tables/HospitalSpaceTable';
import TopNDiagnosesTable from 'tables/TopNDiagnosesTable';
import GetUserData from 'auth/get_user_data';
import AgeCategoryPatient from "../charts/AgeCategoryPatient";
import OldestPatientsTable from "../tables/OldestPatientsTable";
import AllEmployeesInDepartmentsInHospital from "../tables/AllEmployeesInDepartmentsInHospital";
import AgeCategoryEmployee from "../charts/AgeCategoryEmployee";
import PatientBornInMonths from "../charts/PatientBornInMonths";
import GenderPatient from "../charts/GenderPatient";

export default function Dashboard(props) {
  const [hospital, setHospital] = useState('');
  const [hospitalId, setHospitalId] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  const [autoCompleteValue, setAutocompleteValue] = useState('');
  const [date, setDate] = useState(
    new Date()
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
      .split('/')
      .join('-'),
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!props) return;

    if (!props?.isLoggedIn) {
      navigate('/login');
    }
    fetchAppointmentsCount(hospitalId);
  }, [props.isLoggedIn,hospitalId]);

  const fetchHospitals = (hospitalName) => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/hospital/name/${hospitalName}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setHospital(data);
      });
  };

  const fetchAppointmentsCount = (hospitalId, date) => {
    // Fetch logic here
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    const effectiveHospitalId = hospitalId || GetUserData(token).UserInfo.hospital;

    if(date === undefined) {
      date = new Date()
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
        .split('/')
        .join('-');
    }

    fetch(`/dashboard/hospital/appointments-count/${effectiveHospitalId}/${date}`, { headers })
      .then(response => response.json())
      .then(count => {
        setAppointmentsCount(count);
      })
      .catch(error => console.error('Error fetching appointments count:', error));
  };

  const handleHospitalSearch = (event) => {
    fetchHospitals(event.query);
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      setHospitalId(autoCompleteValue.HOSPITAL_ID);
    }
  };

  const formatDate = (paramDate) => {
    if (!paramDate) return;
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const dateToSet = new Date(paramDate).toLocaleDateString('en-US', options);
    setDate(dateToSet.split('/').join('-'));
  };

  return (
    <>
      <div className="dashboard-filter">
        <div>
          <label htmlFor="hospitalName">Nemocnica</label>
          <AutoComplete
            name="hospitalName"
            value={autoCompleteValue}
            suggestions={hospital}
            completeMethod={(e) => handleHospitalSearch(e)}
            field="NAME"
            onChange={(e) => setAutocompleteValue(e.value)}
            placeholder="Zadajte názov nemocnice"
            onKeyDown={handleEnter}
          />
        </div>
        <div>
          <label htmlFor="year">Rok</label>
          <Calendar
            name="year"
            value={date}
            onChange={(e) => formatDate(e.value)}
            view="year"
            dateFormat="yy"
            yearNavigator
            yearRange="2019:2023"
          />
        </div>
      </div>

      <DashboardNumberCard
        title="Počet dnešných appointmentov"
        content={appointmentsCount}
      />

      <Card>
        <HospitalSpaceTable
          hospitalId={hospitalId} />
      </Card>

        <Card>
            <AllEmployeesInDepartmentsInHospital hospitalId={hospitalId} limitRows={20} />
        </Card>
        <Card>
            <AgeCategoryEmployee
                hospitalId={hospitalId}
            ></AgeCategoryEmployee>
        </Card>

      <Card>
        <TopNDiagnosesTable hospitalId={hospitalId} limitRows={10} />
      </Card>

      <Card>
        <Top10BloodDonationsTable
          hospitalId={hospitalId}
          date={date}
        ></Top10BloodDonationsTable>
      </Card>

      <Card>
        <BloodDonationTypes
          hospitalId={hospitalId}
          date={date}
        ></BloodDonationTypes>
      </Card>
        <Card>
            <AgeCategoryPatient
                hospitalId={hospitalId}
            ></AgeCategoryPatient>
        </Card>
        <Card>
            <GenderPatient
                hospitalId={hospitalId}
            ></GenderPatient>
        </Card>
        <Card>
            <OldestPatientsTable hospitalId={hospitalId} limitRows={10} />
        </Card>
        <Card>
            <PatientBornInMonths hospitalId={hospitalId} limitRows={2020} />
        </Card>
    </>
  );
}
