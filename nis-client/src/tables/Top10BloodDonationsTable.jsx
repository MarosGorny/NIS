// @ts-nocheck
import GetUserData from 'auth/get_user_data';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import React, { useEffect, useState } from 'react';

export default function Top10BloodDonationsTable(props) {
  const [bloodDonations, setBloodDonations] = useState(
    Array.from({ length: 10 }),
  );
  const [lazyLoading, setLazyLoading] = useState(false);

  useEffect(() => {
    loadBloodDonationsLazy();
  }, [props?.hospitalId, props?.date]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBloodDonationsLazy = () => {
    setLazyLoading(true);
    const token = localStorage.getItem('logged-user');
    const userData = GetUserData(token);
    const hospitalId = props?.hospitalId || userData.UserInfo.hospital;
    const headers = { authorization: 'Bearer ' + token };
    const date = props?.date || new Date();
    fetch(`/dashboard/top10blood/${hospitalId}/date/${date}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setBloodDonations(data);
        setLazyLoading(false);
      });
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span>Top 10 pacientov s najvyšším počtom darovaní krvi</span>
      </div>
    );
  };

  const columns = [
    {
      field: 'RN',
      header: 'Poradie',
    },
    {
      field: 'NUM_BLOOD_DONATIONS',
      header: 'Počet darovaní',
    },
    {
      field: 'PERSON_NAME',
      header: 'Meno',
    },
  ];

  const loadingTemplate = (options) => {
    return (
      <div
        className="flex align-items-center"
        style={{ height: '17px', flexGrow: '1', overflow: 'hidden' }}
      >
        <Skeleton
          width={
            options.cellEven
              ? options.field === 'year'
                ? '30%'
                : '40%'
              : '60%'
          }
          height="1rem"
        />
      </div>
    );
  };

  const header = renderHeader();
  return (
    <div>
      <div className="card">
        <DataTable
          value={bloodDonations}
          responsiveLayout="scroll"
          selectionMode="single"
          header={header}
          filterDisplay="menu"
          globalFilterFields={['RN', 'NUM_BLOOD_DONATIONS', 'PERSON_NAME']}
          emptyMessage="Žiadne výsledky"
          virtualScrollerOptions={{
            lazy: true,
            onLazyLoad: loadBloodDonationsLazy,
            itemSize: 60,
            delay: 150,
            showLoader: true,
            loading: lazyLoading,
            loadingTemplate,
          }}
        >
          {columns.map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              filter={col.filter}
              body={col.body}
            />
          ))}
        </DataTable>
      </div>
    </div>
  );
}
