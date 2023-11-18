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

export default function PatientVaccinationTable(props) {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState(null);
  const [vaccinations, setVaccinations] = useState(Array.from({ length: 50 }));
  const [lazyLoading, setLazyLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    loadVaccinationsLazy();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadVaccinationsLazy = () => {
    setLazyLoading(true);
    const token = localStorage.getItem('logged-user');
    const tokenParsedData = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    const userId = props.patientId
      ? props.patientId
      : tokenParsedData.UserInfo.userId;
    fetch(`/patient/${userId}/vaccinationHistory`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setVaccinations(data);
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

  const showSuccessDelete = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Úspešne odstránená',
      detail: 'Vakcinácia úšpešne pridaná',
    });
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span>Vakcinácie</span>
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
      TYPE_VACCINATION: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      DOSE_VACCINE: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue('');
  };

  const renderButtonColumn = (rowData) => (
    // TODO - generate button maybe
    <>
      <Button icon="pi pi-cloud-download" onClick={() => console.log('TODO')} />
    </>
  );

  const formatDate = (date) => {
    if (!date) return;
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(date).toLocaleDateString('sk-SK', options);
  };

  const columns = [
    {
      field: 'TYPE_VACCINATION',
      header: 'Typ vykcíny',
      filter: true,
    },
    {
      field: 'DATE_VACCINATION',
      header: 'Dátum vakcinácie',
      filter: true,
      body: (value) => formatDate(value?.DATE_VACCINATION),
    },
    {
      field: 'DATE_RE_VACCINATION',
      header: 'Dátum revakcinácie',
      filter: true,
      body: (value) => formatDate(value?.DATE_RE_VACCINATION),
    },
    {
      field: 'DOSE_VACCINE',
      header: 'Dávka',
      filter: true,
    },
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
          value={vaccinations}
          responsiveLayout="scroll"
          selectionMode="single"
          onSelectionChange={(e) => handleClick(e.value)}
          header={header}
          filters={filters}
          filterDisplay="menu"
          scrollable
          scrollHeight="90vh"
          globalFilterFields={[
            'TYPE_VACCINATION',
            'DATE_VACCINATION',
            'DATE_RE_VACCINATION',
            'DOSE_VACCINE',
          ]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          virtualScrollerOptions={{
            lazy: true,
            onLazyLoad: loadVaccinationsLazy,
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
