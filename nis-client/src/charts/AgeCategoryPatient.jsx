'/age-category-patient/:hospitalId'
// @ts-nocheck
import GetUserData from 'auth/get_user_data';
import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';

// ... (imports)

export default function AgeCategoryPatient(props) {
    const [chartData, setChartData] = useState({});
    const [ageCategoryPatient, setAgeCategoryPatient] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAgeCategoryPatient();
    }, [props?.hospitalId]);


    useEffect(() => {
        if (!ageCategoryPatient) return;

        const ageCategoryPatientTypes = Object.keys(ageCategoryPatient);
        const ageData = ageCategoryPatientTypes.map((ageCategory) => ageCategoryPatient[ageCategory]);

        const data = {
            labels: ageCategoryPatientTypes,
            datasets: [
                {
                    label: 'Vek pacientov',
                    data: ageData,
                    backgroundColor: [
                        "#42A5F5",
                        "#66BB6A",
                        "#FFA726",
                        "#26C6DA",
                        "#7E57C2",
                        "#FF7043",
                        "#8D6E63"
                    ],
                },
            ],
        };

        setChartData(data);
    }, [ageCategoryPatient]);

    const fetchAgeCategoryPatient = () => {
        setLoading(true);

        const token = localStorage.getItem('logged-user');
        const headers = { authorization: 'Bearer ' + token };
        const userData = GetUserData(token);
        const hospitalId = props?.hospitalId || userData.UserInfo.hospital;

        fetch(`/dashboard/age-category-patient/${hospitalId}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setAgeCategoryPatient(data);
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
        scales: {
            y: {
                suggestedMax: 5000, // Set the maximum value for the y-axis
            },
        },

    };

    return (
        <Card title="Typy pacientov podľa veku" className="flex justify-content-center">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Chart type="bar" data={chartData} options={chartOptions} style={{ width: '100%', height: '400px' }} />
            )}
        </Card>
    );
}

