import React from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

const HospitalSpaceTable = ({ data }) => {

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
    if (percentage >= 75) return 'red'; // High occupancy
    if (percentage >= 50) return 'orange'; // Moderate occupancy
    if (percentage >= 25) return 'blue'; // Low occupancy
    return 'green'; // Very low occupancy
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
      <DataTable value={data} responsiveLayout="scroll" header={header}>
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
