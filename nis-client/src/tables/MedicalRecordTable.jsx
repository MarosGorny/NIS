// @ts-nocheck
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import GetUserData from '../auth/get_user_data';

export default function MedicalRecordTable(props) {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState(
    Array.from({ length: 50 }),
  );
  const [lazyLoading, setLazyLoading] = useState(false);
  const [medicalRecordImgUrl, setMedicalRecordImgUrl] = useState(null);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    loadMedicalRecordsLazy();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMedicalRecordsLazy = () => {
    setLazyLoading(true);
    const token = localStorage.getItem('logged-user');
    const tokenParsedData = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    const userId = props.patientId
      ? props.patientId
      : tokenParsedData.UserInfo.userId;
    fetch(`/medicalRecord/patient/${userId}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setMedicalRecords(data);
        setLazyLoading(false);
      });
  };

  const fetchDialogData = async (recordId) => {
    if (!props.patientId) return;

    const token = localStorage.getItem('logged-user');
    const headers = { authorization: 'Bearer ' + token };
    const tokenParsedData = GetUserData(token);
    const userId = props.patientId
      ? props.patientId
      : tokenParsedData.UserInfo.userId;
    const response = await fetch(
      `/medicalRecord/patient/${userId}/record/${recordId}`,
      { headers },
    );
    const data = await response.json();
    return data;
  };

  const fetchMedicalRecordImage = async (recordId) => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/medicalRecord/image/record/${recordId}`, { headers })
      .then((res) => res.blob())
      .then((result) => {
        setMedicalRecordImgUrl(URL.createObjectURL(result));
      });
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span>Medické zákroky</span>
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
            to="/medicalRecord/form"
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
      DATE_OF_ENTRY: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      PROCEDURE_NAME: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue('');
  };

  const handleMedicalRecordRowClick = async (value) => {
    const dialogData = await fetchDialogData(value.RECORD_ID);
    await fetchMedicalRecordImage(value.RECORD_ID);
    setShowDialog(true);
    setSelectedRow(dialogData);
  };

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
    setMedicalRecordImgUrl(null);
  };

  const handleEditButtonClick = (value) => {
    navigate('/medicalRecord/form', {
      state: {
        medicalRecordId: value.RECORD_ID,
        patientId: props.patientId ? props.patientId : null,
      },
    });
  };

  const renderButtonColumn = (rowData) => (
    <Button
      icon="pi pi-pencil"
      onClick={() => handleEditButtonClick(rowData)}
    />
  );

  const formatDate = (date) => {
    if (!date) return;
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(date).toLocaleDateString('sk-SK', options);
  };

  const columns = [
    {
      field: 'DATE_OF_ENTRY',
      header: 'Dátum zápisu',
      filter: true,
      body: (value) => formatDate(value?.DATE_OF_ENTRY),
    },
    {
      field: 'DATE_OF_UPDATE',
      header: 'Dátum úpravy',
      filter: true,
      body: (value) => formatDate(value?.DATE_OF_UPDATE),
    },
    {
      field: 'PROCEDURE_NAME',
      header: 'Procedúra',
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
          value={medicalRecords}
          responsiveLayout="scroll"
          selectionMode="single"
          onSelectionChange={(e) => handleMedicalRecordRowClick(e.value)}
          header={header}
          filters={filters}
          filterDisplay="menu"
          scrollable
          scrollHeight="90vh"
          globalFilterFields={[
            'DATE_OF_ENTRY',
            'DATE_OF_UPDATE',
            'PROCEDURE_NAME',
          ]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          virtualScrollerOptions={{
            lazy: true,
            onLazyLoad: loadMedicalRecordsLazy,
            itemSize: 80,
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
      <div id="patient-profile-medical-record-dialog">
        <Dialog
          header={selectedRow ? selectedRow.PROCEDURE_NAME : ''}
          visible={showDialog}
          style={{ width: '50vw' }}
          onHide={() => onHide()}
        >
          <div className="patient-profile-medical-record-dialog-row">
            <span>Dátum zápisu: </span>
            <span>{formatDate(selectedRow?.DATE_OF_ENTRY)}</span>
          </div>
          <div className="patient-profile-medical-record-dialog-row">
            <span>Dátum úpravy: </span>
            <span>{formatDate(selectedRow?.DATE_OF_UPDATE)}</span>
          </div>
          <div className="patient-profile-medical-record-dialog-row">
            <span>Poznámky: </span>
            <p>{selectedRow?.NOTE}</p>
          </div>
          <div className="patient-profile-medical-record-dialog-row">
            <span>Výsledok testu: </span>
            <p>{selectedRow?.TEST_RESULT}</p>
          </div>
          <div className="patient-profile-medical-record-dialog-row">
            <span>Diagnóza: </span>
            <span>{selectedRow?.DIAGNOSE_NAME}</span>
          </div>
          <div className="patient-profile-medical-record-dialog-row">
            <span>Meno doktora: </span>
            <span>{selectedRow?.DOCTOR_NAME}</span>
          </div>
          <Image
            src={medicalRecordImgUrl}
            alt="Medical Record Image"
            preview={true}
          />
        </Dialog>
      </div>
    </div>
  );
}
