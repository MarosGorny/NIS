'/age-category-patient/:hospitalId'
// @ts-nocheck
import GetUserData from 'auth/get_user_data';
import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';



// ... (imports)

export default function PatientBornInMonths(props) {
    const [chartData, setChartData] = useState({});
    const [patient, setPatient] = useState({});
    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(2020);

    useEffect(() => {
        fetchMonthCountPatient();
    }, [props?.hospitalId, year]);  // Add year to the dependency array


    useEffect(() => {
        if (!patient) return;

        const monthType = Object.keys(patient);
        const monthData = monthType.map((month) => patient[month]);

        const data = {
            labels: monthType,
            datasets: [
                {
                    label: 'Mesiace',
                    data: monthData,
                    backgroundColor: [
                        "#3366cc",
                        "#ff3366",
                        "#66cc33",
                        "#ffcc66",
                        "#cc3366",
                        "#66cc99",
                        "#ff9966",
                        "#3399cc",
                        "#ffcc33",
                        "#cc6699",
                        "#99cc33",
                        "#cc9966",
                    ],
                },
            ],
        };

        setChartData(data);
    }, [patient]);

    const fetchMonthCountPatient = () => {
        setLoading(true);
        const token = localStorage.getItem('logged-user');
        const headers = { authorization: 'Bearer ' + token };
        const userData = GetUserData(token);
        const hospitalId = props?.hospitalId || userData.UserInfo.hospital;
        const new_year = year || 2020;

        fetch(`/dashboard/patient-born-months/${hospitalId}/${new_year}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setPatient(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };
    const handleYearChange = (e) => {
        setYear(e.value);
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
                suggestedMax: 100, // Set the maximum value for the y-axis
            },
        },

    };
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 }, (_, index) => currentYear - index);
    return (
        <Card title={'Množstvo pacientov narodených v jednotlivých mesiacoch roka ' + year} className="flex justify-content-center">
            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-calendar"></i>
                </span>
                <Dropdown
                    value={year}
                    options={years.map((year) => ({ label: year.toString(), value: year }))}
                    onChange={(e) => setYear(e.value)}  // Update this line
                    placeholder="Select Year"
                />
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Chart type="bar" data={chartData} options={chartOptions} style={{ width: '100%', height: '400px' }} />
            )}
        </Card>
    );
}

