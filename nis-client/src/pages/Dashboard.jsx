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

export default function Dashboard(props) {
  const [hospital, setHospital] = useState('');
  const [hospitalId, setHospitalId] = useState(0);
  const [hospitalSpaceData, setHospitalSpaceData] = useState([]);
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
    fetchFreeSpaces();
    fetchAppointmentsCount(1); //TODO: Set for hospitalId
  }, [props.isLoggedIn]);

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

  const fetchFreeSpaces = () => {
    //if (!hospitalId) return;
    //TODO: Set for hospitalId
    
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };

    fetch(`dashboard/hospital/free-spaces/${1}`, { headers })
      .then(response => response.json())
      .then(data => {

        setHospitalSpaceData(data);
      })
      .catch(error => console.error('Error fetching free spaces:', error));
  };

  const fetchAppointmentsCount = (hospitalId, date) => {
    // Fetch logic here
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };

    fetch(`/hospital/appointments-count/${1}/${date}`, { headers })
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
        <HospitalSpaceTable data={hospitalSpaceData} />
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
    </>
  );
}
