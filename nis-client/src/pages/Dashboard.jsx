// @ts-nocheck
import BloodDonationTypes from 'charts/BloodDonationTypes';
import DashboardNumberCard from 'components/DashboardNumberCard';
import { AutoComplete } from 'primereact/autocomplete';
import { Card } from 'primereact/card';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Top10BloodDonationsTable from 'tables/Top10BloodDonationsTable';
import { Calendar } from 'primereact/calendar';

export default function Dashboard(props) {
  const [hospital, setHospital] = useState('');
  const [hospitalId, setHospitalId] = useState(0);
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
      <AutoComplete
        value={autoCompleteValue}
        suggestions={hospital}
        completeMethod={(e) => handleHospitalSearch(e)}
        field="NAME"
        onChange={(e) => setAutocompleteValue(e.value)}
        placeholder="Zadajte názov nemocnice"
        onKeyDown={handleEnter}
      />

      <Calendar
        value={date}
        onChange={(e) => formatDate(e.value)}
        view="year"
        dateFormat="yy"
        yearNavigator
        yearRange="2019:2023"
      />

      <DashboardNumberCard
        title="Počet voľných lôžok"
        content="123"
      ></DashboardNumberCard>
      <DashboardNumberCard
        title="Počet dnešných appointmentov"
        content="123"
      ></DashboardNumberCard>
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
