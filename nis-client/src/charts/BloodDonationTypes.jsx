// @ts-nocheck
import GetUserData from 'auth/get_user_data';
import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';

export default function BloodDonationTypes(props) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [bloodTypes, setBloodTypes] = useState({});

  useEffect(() => {
    fetchBloodTypeData();
  }, [props?.hospitalId, props?.date]);

  useEffect(() => {
    if (!bloodTypes) return;

    const bloodDataTypes = Object.keys(bloodTypes);
    const bloodData = [];
    bloodDataTypes.forEach((bloodType) => {
      bloodData.push(bloodTypes[bloodType]);
    });

    const data = {
      labels: bloodDataTypes,
      datasets: [
        {
          data: bloodData,
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [bloodTypes]);

  const fetchBloodTypeData = () => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    const userData = GetUserData(token);
    const hospitalId = props?.hospitalId || userData.UserInfo.hospital;
    const date = props?.date || new Date();
    fetch(`/dashboard/bloodTypesInDonations/${hospitalId}/date/${date}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setBloodTypes(data);
      });
  };

  return (
    <div className="card flex justify-content-center">
      <Chart
        type="pie"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-30rem"
      />
    </div>
  );
}
