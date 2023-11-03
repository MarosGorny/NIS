// @ts-nocheck
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import GetUserData from '../auth/get_user_data';

export default function PatientsTable() {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [patients, setPatients] = useState(Array.from({ length: 25000 }));
  const [lazyLoading, setLazyLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    loadPatientsLazy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPatientsLazy = () => {
    setLazyLoading(true);
    const token = localStorage.getItem('logged-user');
    const tokenParsedData = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/patient/hospital/${tokenParsedData.UserInfo.hospital}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        setLazyLoading(false);
      });
  };

  const deletePatient = async (rowData) => {
    const token = localStorage.getItem('logged-user');
    const requestOptionsPatient = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        birth_number: rowData.BIRTH_NUMBER,
      }),
    };

    fetch(`/patient/delete`, requestOptionsPatient).then((result) => {
      if (result.status === 200) {
        showSuccess();
        loadPatientsLazy();
      } else {
        showError();
        console.error(result);
      }
    });
  };

  const onHide = () => {
    setShowDialog(false);
  };

  const onSubmit = () => {
    setShowDialog(false);
    navigate('/patient', { state: selectedRow.PATIENT_ID });
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
  };

  const showSuccess = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Úspešne odstránený',
      detail: 'Pacient bol úspešne odstránený',
    });
  };

  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Pacient nie je odstránený',
      detail: 'Pacienta sa nepodarilo odstrániť',
    });
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          icon="pi pi-times"
          className="p-button-danger"
          onClick={() => onHide()}
          style={{ padding: '1rem' }}
        />
        <Button
          icon="pi pi-eye"
          onClick={() => onSubmit()}
          autoFocus
          style={{ padding: '1rem' }}
        />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span>Pacienti</span>
        <div className="table-header-right">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Vyhľadať..."
            />
          </span>
          <Link to="/patient/form">
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
      NAME: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      SURNAME: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      BIRTH_NUMBER: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      POSTAL_CODE: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue('');
  };

  const isForeign = () => {
    if (selectedRow !== null) {
      const monthNumber = Number(selectedRow.BIRTH_NUMBER.substring(2, 3));
      if ([2, 3].includes(monthNumber)) {
        return 'Cudzinec';
      } else if ([7, 8].includes(monthNumber)) {
        return 'Cudzinka';
      }
    }
  };

  const getSex = () => {
    if (selectedRow !== null) {
      const monthNumber = Number(selectedRow.BIRTH_NUMBER.substring(2, 3));
      return [5, 6, 7, 8].includes(monthNumber) ? 'Žena' : 'Muž';
    }
  };

  const getAge = () => {
    if (!selectedRow) return;

    const birthDate = new Date(getStringDateFromBirthDate());
    var today = new Date();
    return getDifferenceInDays(today, birthDate);
  };

  const getDifferenceInDays = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return Math.round(diffInMs / (1000 * 60 * 60 * 24) / 365);
  };

  const getStringDateFromBirthDate = () => {
    if (!selectedRow) return;

    let yearNumber = Number(selectedRow.BIRTH_NUMBER.substring(0, 2));
    let monthNumber = Number(selectedRow.BIRTH_NUMBER.substring(2, 4));
    const isForeignNumber = Number(selectedRow.BIRTH_NUMBER.substring(2, 3));
    if (yearNumber >= 0 && yearNumber <= 23) {
      yearNumber = selectedRow.BIRTH_NUMBER.length === 10 ? '19' : '20';
    } else {
      yearNumber = '19';
    }

    if ([2, 3, 7, 8].includes(isForeignNumber)) {
      monthNumber = monthNumber - 20;
    }

    return (
      yearNumber +
      selectedRow.BIRTH_NUMBER.substring(0, 2) +
      '-' +
      (monthNumber % 50) +
      '-' +
      selectedRow.BIRTH_NUMBER.substring(4, 6)
    );
  };

  const deletePatientAction = (rowData) => (
    <Button
      icon="pi pi-times"
      onClick={() => deletePatient(rowData)}
      className="p-button-danger"
    />
  );

  const columns = [
    { field: 'BIRTH_NUMBER', header: 'Rodné číslo', filter: true },
    { field: 'NAME', header: 'Meno', filter: true },
    { field: 'SURNAME', header: 'Priezvisko', filter: true },
    { field: 'POSTAL_CODE', header: 'PSČ', filter: true },
    { field: '', header: '', body: deletePatientAction, filter: false },
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
          value={patients}
          responsiveLayout="scroll"
          selectionMode="single"
          selection={selectedRow}
          onSelectionChange={(e) => handleClick(e.value)}
          header={header}
          filters={filters}
          filterDisplay="menu"
          scrollable
          scrollHeight="90vh"
          globalFilterFields={[
            'BIRTH_NUMBER',
            'NAME',
            'SURNAME',
            'POSTAL_CODE',
          ]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
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
      <Dialog
        header={
          selectedRow != null
            ? selectedRow.NAME + ' ' + selectedRow.SURNAME
            : ''
        }
        visible={showDialog}
        style={{ width: '50vw' }}
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      >
        <p>{getSex()}</p>
        <p>{getAge() + ' rokov'}</p>
        <p>{isForeign()}</p>
        <p>{selectedRow != null ? 'PSČ ' + selectedRow.POSTAL_CODE : ''}</p>
      </Dialog>
    </div>
  );
}
