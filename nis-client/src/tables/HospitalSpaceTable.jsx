import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import GetUserData from 'auth/get_user_data';

const HospitalSpaceTable = ({ hospitalId }) => {
  const [hospitalSpaces, setHospitalSpaces] = useState([]);

  useEffect(() => {
    fetchHospitalSpaces();
  }, [hospitalId]);

  const fetchHospitalSpaces = () => {
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    const effectiveHospitalId = hospitalId || GetUserData(token).UserInfo.hospital;

    fetch(`dashboard/hospital/free-spaces/${effectiveHospitalId}`, { headers })
      .then(response => response.json())
      .then(data => {
        setHospitalSpaces(data);
      })
      .catch(error => console.error('Error fetching hospital spaces:', error));
  };

  const calculateOccupiedSpaces = (rowData) => {
    return rowData.TOTAL_CAPACITY - rowData.FREE_SPACES;
  };

  const calculateOccupancyPercentage = (rowData) => {
    const occupiedSpaces = calculateOccupiedSpaces(rowData);
    const occupancyPercentage = ((occupiedSpaces / rowData.TOTAL_CAPACITY) * 100).toFixed(2);
    return (
      <div style={{ color: getColorByPercentage(occupancyPercentage) }}>
        {`${occupancyPercentage}%`}
      </div>
    );
  };

  const getColorByPercentage = (percentage) => {
    if (percentage >= 75) return 'red';
    if (percentage >= 50) return 'orange';
    if (percentage >= 25) return 'blue';
    return 'green';
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span>Využitie nemocničných priestorov</span>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable value={hospitalSpaces} responsiveLayout="scroll" header={header}>
        <Column field="DEPARTMENT_NAME" header="Názov oddelenia" />
        <Column field="FREE_SPACES" header="Voľné miesta" />
        <Column body={calculateOccupiedSpaces} header="Obsadené miesta" />
        <Column field="TOTAL_CAPACITY" header="Kapacita" />
        <Column body={calculateOccupancyPercentage} header="Obsadenosť (%)" />
      </DataTable>
    </div>
  );
};

export default HospitalSpaceTable;
