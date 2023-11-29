import GetUserData from 'auth/get_user_data';
import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import { InputNumber } from 'primereact/inputnumber';

export default function TopNDiagnosesTable(props) {
  const [diagnoses, setDiagnoses] = useState(Array.from({ length: props.limitRows }));
  const [lazyLoading, setLazyLoading] = useState(false);
  const [limitRows, setLimitRows] = useState(props.limitRows || 10);

  useEffect(() => {
    loadDiagnosesLazy();
  }, [props.hospitalId, limitRows]); 

  const loadDiagnosesLazy = () => {
    setLazyLoading(true);
    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };

    const hospitalId = props.hospitalId || GetUserData(token).UserInfo.hospital;
    fetch(`/dashboard/top-diagnoses/${hospitalId}/${limitRows}`, { headers })
      .then(response => response.json())
      .then(data => {
        setDiagnoses(data);
        setLazyLoading(false);
      });
  };

  const handleLimitRowsChange = (e) => {
    setLimitRows(e.value);
  };

  const renderHeader = () => {
    return (
      <div>
        <div className="table-header">
          <span>Top {limitRows} diagnózy podľa priemernej dĺžky pobytu</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: '10px' }}>
          <label htmlFor="limitRows" style={{ marginRight: '5px' }}>Limit:</label>
          <InputNumber
            id="limitRows"
            value={limitRows}
            onValueChange={handleLimitRowsChange}
            mode="decimal"
            min={1}
            max={100}
            showButtons
            style={{ width: '10px' }}
          />
        </div>
      </div>
    );
  };
  
  

  const loadingTemplate = (options) => {
    return (
      <div className="flex align-items-center" style={{ height: '17px', flexGrow: '1', overflow: 'hidden' }}>
        <Skeleton width={options.cellEven ? '40%' : '60%'} height="1rem" />
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div>
      <div className="card">
        <DataTable
          value={diagnoses}
          responsiveLayout="scroll"
          header={header}
          emptyMessage="No diagnoses found"
          virtualScrollerOptions={{
            lazy: true,
            onLazyLoad: loadDiagnosesLazy,
            itemSize: 60,
            delay: 150,
            showLoader: true,
            loading: lazyLoading,
            loadingTemplate,
          }}
        >
          {/* <Column field="DIAGNOSE_CODE" header="Diagnose Code" /> */}
          <Column field="DIAGNOSIS_NAME" header="Diagnóza" />
          <Column field="AVERAGE_STAY_DURATION" header="Priemerná dĺžka pobytu (dni)" />
        </DataTable>
      </div>
    </div>
  );
}
