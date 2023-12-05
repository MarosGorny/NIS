
// @ts-nocheck
import GetUserData from 'auth/get_user_data';
import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';

// ... (imports)

export default function AgeCategoryEmployee(props) {
    const [chartData, setChartData] = useState({});
    const [ageCategoryEmployee, setAgeCategoryEmployee] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAgeCategoryEmployee();
    }, [props?.hospitalId]);

    useEffect(() => {
        if (!ageCategoryEmployee) return;

        const ageCategoryEmployeeTypes = Object.keys(ageCategoryEmployee);
        const ageData = ageCategoryEmployeeTypes.map((ageCategory) => ageCategoryEmployee[ageCategory]);

        const data = {
            labels: ageCategoryEmployeeTypes,
            datasets: [
                {
                    label: 'Vek zamestnancov',
                    data: ageData,
                    backgroundColor: [
                        "#7E57C2",
                        "#FF7043",
                        "#8D6E63"
                    ],
                },
            ],
        };

        setChartData(data);
    }, [ageCategoryEmployee]);

    const fetchAgeCategoryEmployee = () => {
        setLoading(true);

        const token = localStorage.getItem('logged-user');
        const headers = { authorization: 'Bearer ' + token };
        const userData = GetUserData(token);
        const hospitalId = props?.hospitalId || userData.UserInfo.hospital;

        fetch(`/dashboard/age-category-employee/${hospitalId}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setAgeCategoryEmployee(data);
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
        <Card title="Typy zamestnancov podľa veku" className="flex justify-content-center">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Chart type="bar" data={chartData} options={chartOptions} style={{ width: '100%', height: '400px' }} />
            )}
        </Card>
    );
}

