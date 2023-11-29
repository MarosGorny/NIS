// @ts-nocheck
import GetUserData from 'auth/get_user_data';
import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';

export default function BloodDonationTypes(props) {
  const [chartData, setChartData] = useState({});
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
          backgroundColor: [
            "#42A5F5",
            "#66BB6A",
            "#FFA726",
            "#26C6DA",
            "#7E57C2",
            "#FF7043",
            "#EC407A",
            "#8D6E63"
          ],
        },
      ],
    };

    setChartData(data);
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

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card title="Typy darovanej krvi" className="flex justify-content-center">
      <div style={{ width: '100%', maxWidth: '500px', minHeight: '300px' }}>
        <Chart
          type="pie"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </Card>
  );
}
