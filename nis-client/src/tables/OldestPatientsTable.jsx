import GetUserData from 'auth/get_user_data';
import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import { InputNumber } from 'primereact/inputnumber';

export default function OldestPatientsTable(props) {
    const [patients, setPatients] = useState(Array.from({ length: props.limitRows }));
    const [lazyLoading, setLazyLoading] = useState(false);
    const [limitRows, setLimitRows] = useState(props.limitRows || 3);

    useEffect(() => {
        loadPatientsLazy();
    }, [props.hospitalId, limitRows]);

    const loadPatientsLazy = () => {
        setLazyLoading(true);
        const token = localStorage.getItem('logged-user');
        const headers = { authorization: 'Bearer ' + token };

        const hospitalId = props.hospitalId || GetUserData(token).UserInfo.hospital;
        fetch(`/dashboard/oldest-patients/${hospitalId}/${limitRows}`, { headers })
            .then(response => response.json())
            .then(data => {
                setPatients(data);
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
                    <span>Top {limitRows} najstarších pacientov</span>
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
                    value={patients}
                    responsiveLayout="scroll"
                    header={header}
                    emptyMessage="No patients found"
                    virtualScrollerOptions={{
                        lazy: true,
                        onLazyLoad: loadPatientsLazy,
                        itemSize: 60,
                        delay: 150,
                        showLoader: true,
                        loading: lazyLoading,
                        loadingTemplate,
                    }}
                >
                    {/* <Column field="DIAGNOSE_CODE" header="Diagnose Code" /> */}
                    <Column field="NAME" header="Meno" />
                    <Column field="SURNAME" header="Priezvisko" />
                    <Column field="BIRTH_NUMBER" header="Rodné číslo" />
                    <Column field="BIRTH_DATE" header="Dátum narodenia" />
                    <Column field="AGE" header="Vek" />
                </DataTable>
            </div>
        </div>
    );
}
