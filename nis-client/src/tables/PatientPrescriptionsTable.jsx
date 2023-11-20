// @ts-nocheck
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import GetUserData from '../auth/get_user_data';

export default function PatientPrescriptionsTable(props) {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState(null);
  const [prescriptions, setPrescriptions] = useState(
    Array.from({ length: 50 }),
  );
  const [lazyLoading, setLazyLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    loadPrescriptionsLazy();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPrescriptionsLazy = () => {
    setLazyLoading(true);
    const token = localStorage.getItem('logged-user');
    const tokenParsedData = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    const userId = props.patientId
      ? props.patientId
      : tokenParsedData.UserInfo.userId;
    fetch(`/prescription/patient/${userId}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setPrescriptions(data);
        setLazyLoading(false);
      });
  };

  const handleClick = (value) => {
    navigate('/prescription/form', {
      state: {
        prescriptionId: value.PRESCRIPTION_ID,
        patientId: props.patientId ? props.patientId : null,
      },
    });
  };

  const deletePrescription = async (rowData) => {
    const token = localStorage.getItem('logged-user');
    const requestOptionsPatient = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    };

    fetch(
      `/prescription/delete/${rowData.PRESCRIPTION_ID}`,
      requestOptionsPatient,
    ).then((result) => {
      if (result.status === 200) {
        showSuccessDelete();
        loadPrescriptionsLazy();
      } else {
        showErrorDelete();
        console.error(result);
      }
    });
  };

  const showSuccessDelete = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Úspešne odstránený',
      detail: 'Recept bol úspešne odstránený',
    });
  };

  const showErrorDelete = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Recept nie je odstránený',
      detail: 'Recept sa nepodarilo odstrániť',
    });
  };

  const generateXML = (rowData) => {
    if (!rowData.PRESCRIPTION_ID) {
      console.error('Nenájdený prescription id');
      return;
    }

    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/prescription/xml/${rowData.PRESCRIPTION_ID}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.XML || !data.PRESCRIPTION_ID) {
          console.error('Nie je definované XML alebo prescription ID');
          return;
        }

        const blob = new Blob([data.XML], { type: 'text/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `prescription_${data.PRESCRIPTION_ID}.xml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span>Recepty</span>
        <div className="table-header-right">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Vyhľadať..."
            />
          </span>
          <Link
            to="/prescription/form"
            state={{
              patientId: props.patientId ? props.patientId : null,
            }}
          >
            <Button
              type="button"
              icon="pi pi-plus"
              className="p-button-secondary"
            />
          </Link>
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      DATE_ISSUED: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      NAME: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue('');
  };

  const renderButtonColumn = (rowData) => (
    <>
      <Button icon="pi pi-pencil" onClick={() => handleClick(rowData)} />
      <Button
        icon="pi pi-cloud-download"
        onClick={() => generateXML(rowData)}
      />
      <Button
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => deletePrescription(rowData)}
      />
    </>
  );

  const formatDate = (date) => {
    if (!date) return;
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(date).toLocaleDateString('sk-SK', options);
  };

  const columns = [
    {
      field: 'DATE_ISSUED',
      header: 'Dátum predpísania',
      filter: true,
      body: (value) => formatDate(value?.DATE_ISSUED),
    },
    {
      field: 'DATE_EXPIRY',
      header: 'Dátum expirácie',
      filter: true,
      body: (value) => formatDate(value?.DATE_EXPIRY),
    },
    { field: 'NAME', header: 'Diagnóza', filter: true },
    { field: '', header: '', body: renderButtonColumn, filter: false },
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
      <Toast ref={toast} />
      <div className="card">
        <DataTable
          value={prescriptions}
          responsiveLayout="scroll"
          selectionMode="single"
          onSelectionChange={(e) => handleClick(e.value)}
          header={header}
          filters={filters}
          filterDisplay="menu"
          scrollable
          scrollHeight="90vh"
          globalFilterFields={['DATE_ISSUED', 'DATE_EXPIRY', 'NAME']}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          virtualScrollerOptions={{
            lazy: true,
            onLazyLoad: loadPrescriptionsLazy,
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