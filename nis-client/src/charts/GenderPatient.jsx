'/age-category-patient/:hospitalId'
// @ts-nocheck
import GetUserData from 'auth/get_user_data';
import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';

// ... (imports)

export default function GenderPatient(props) {
    const [chartData, setChartData] = useState({});
    const [genderPatient, setGenderPatient] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGenderPatient();
    }, [props?.hospitalId]);


    useEffect(() => {
        if (!genderPatient) return;

        const genderPatientTypes = Object.keys(genderPatient);
        const genderData = genderPatientTypes.map((gender) => genderPatient[gender]);

        const data = {
            labels: genderPatientTypes,
            datasets: [
                {
                    label: 'Pohlavie pacientov',
                    data: genderData,
                    backgroundColor: [
                        "#42A5F5",
                        "#66BB6A"
                    ],
                },
            ],
        };

        setChartData(data);
    }, [genderPatient]);

    const fetchGenderPatient = () => {
        setLoading(true);

        const token = localStorage.getItem('logged-user');
        const headers = { authorization: 'Bearer ' + token };
        const userData = GetUserData(token);
        const hospitalId = props?.hospitalId || userData.UserInfo.hospital;

        fetch(`/dashboard/patient-genders/${hospitalId}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setGenderPatient(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
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
        <Card title="Typy pacientov podľa pohlavia" className="flex justify-content-center">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Chart type="pie" data={chartData} options={chartOptions} style={{ width: '100%', height: '400px' }} />
            )}
        </Card>
    );
}
