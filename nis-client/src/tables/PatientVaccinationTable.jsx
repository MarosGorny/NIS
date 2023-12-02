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

  const deleteVaccination = async (rowData) => {
    const token = localStorage.getItem('logged-user');
    const requestOptionsPatient = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    };

    fetch(
      `/vaccine/${rowData.VACCINATION_ID}/patient/${rowData.PATIENT_ID}`,
      requestOptionsPatient,
    ).then((result) => {
      if (result.status === 200) {
        showSuccessDelete();
        loadVaccinationsLazy();
      } else {
        showErrorDelete();
        console.error(result);
      }
    });
  };

  const showSuccessDelete = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Úspešne odstránená',
      detail: 'Vakcinácia úspešne odstránená',
    });
  };

  const showErrorDelete = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Vakcinácia nie je odstránená',
      detail: 'Vakcináciu sa nepodarilo odstrániť',
    });
  };

  const handleClick = (value) => {
    navigate('/vaccine/form', {
      state: {
        vaccineId: value,
        patientId: props.patientId ? props.patientId : null,
      },
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
            to="/vaccine/form"
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
      VACCINE_NAME: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      VACCINATION_DOSE: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue('');
  };

  const renderButtonColumn = (rowData) => (
    // TODO - generate button maybe
    <>
      <Button
        icon="pi pi-pencil"
        onClick={() => handleClick(rowData.VACCINATION_ID)}
      />
      <Button
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => deleteVaccination(rowData)}
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
      field: 'VACCINE_NAME',
      header: 'Meno vakcíny',
      filter: true,
    },
    {
      field: 'VACCINATION_DATE',
      header: 'Dátum vakcinácie',
      filter: true,
      body: (value) => formatDate(value?.VACCINATION_DATE),
    },
    {
      field: 'VACCINATION_NEXT_DATE',
      header: 'Dátum revakcinácie',
      filter: true,
      body: (value) => formatDate(value?.VACCINATION_NEXT_DATE),
    },
    {
      field: 'VACCINATION_DOSE',
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
            'VACCINE_NAME',
            'VACCINATION_DATE',
            'VACCINATION_NEXT_DATE',
            'VACCINATION_DOSE',
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
