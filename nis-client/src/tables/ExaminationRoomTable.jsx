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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { VirtualScroller } from 'primereact/virtualscroller';
import { classNames } from 'primereact/utils';

export default function ExaminationRoomTable() {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [actualSupplies, setActualSupplies] = useState([]);
   const [examinationRooms, setExaminationRooms] = useState([]);
    const [lazyLoading, setLazyLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [showSuppliesDialog, setShowSuppliesDialog] = useState(false);
    const [examinationRoomCode, setExaminationRoomCode] = useState(null);
    const[rowDataAtr, setRowDataAtr] = useState([]);
    const[rowDataDelete, setRowDataDelete] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        quantity: ''
    });
    const [visible, setVisible] = useState(false);
    const toastDelete = useRef(null);
    const [reloadDialog, setReloadDialog] = useState(false);
    const dataTableRef = useRef(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    const [suppliesArray, setSuppliesArray] = useState(null);
    const toastRef = useRef(null);


    useEffect(() => {
        loadExaminationRoomsLazy();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        initFilters();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if(Object.keys(actualSupplies).length>0){
            setShowSuppliesDialog(true);
        }

    }, [actualSupplies]);

    useEffect(() => {
        setSuppliesArray(transformedSuppliesArray);

    }, [actualSupplies]);


    /*
         ======================================== NACITAVANIE AMBULANCIE ================================================================
     */

        /*
            Zobrazenie tabulku s informaciami o oddeleniach
         */

    const loadExaminationRoomsLazy = () => {
        setLazyLoading(true);
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token };
        fetch(`/examination/hospital/${tokenParsedData.UserInfo.hospital}`, {
            headers,
        })
            .then((response) => response.json())
            .then((data) => {
                setExaminationRooms(data);
                setLazyLoading(false);
            });
    };

    /*
        Sluzi na filtrovanie
     */
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    /*
        Filtre
     */
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            EXAMINATION_LOCATION_CODE: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            NAME_ROOM: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            DEPARTMENT_LOCATION_CODE: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            DOCTOR_ID: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            NURSE_ID: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
        });
        setGlobalFilterValue('');
    };

    /*
        SLuzi na ziskanie informacie pre danu ambulanciu, aky lekar a aka sestra sa tam nachdza
     */
    const loadStaffLazy = (value) => {
        setLazyLoading(true);
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token,'Content-Type': 'application/json' };
        const body =JSON.stringify( {staffId: value.DOCTOR_ID, staffId1:value.NURSE_ID});
        fetch(`/examination/staff`, {
            method: 'POST',
            headers, body
        })
            .then((response) => response.json())
            .then((data) => {
                setSelectedRow(data);
                console.log(data);
                setLazyLoading(false);
            });
    };

    /*
           Sluzi na zobrazenie informacie o lekarovi a sestricke
     */
    const getNameOfStaff = () => {
        if (selectedRow !== null) {
            //console.log(selectedRow.return_val["MENOPRIEZVISKO"]);
            let o_nurse = selectedRow.nurse
            let o_doctor = selectedRow.doctor

            return (
                <div>

                    <h2>Lekár:</h2>

                    <p>Meno a priezvisko: { o_doctor[0].MENOPRIEZVISKO}</p>
                    <p>Odbor: { o_doctor[0].ODBOR}</p>
                    <p>Pozicia: { o_doctor[0].POZICIA}</p>
                    <p>Specializacia: { o_doctor[0].SPECIALIZACIA}</p>

                    <h2>Sestra:</h2>

                    <p>Meno a priezvisko: {o_nurse[0].MENOPRIEZVISKO}</p>
                    <p>Odbor: {o_nurse[0].ODBOR}</p>
                    <p>Pozicia: {o_nurse[0].POZICIA}</p>
                    <p>Specializacia: {o_nurse[0].SPECIALIZACIA}</p>


                </div>
            );
        }
    };

    const onHide = () => {
        setShowDialog(false);
        setSelectedRow(null);
    };


    const handleClick = (value) => {

        setShowDialog(true);
        //setSelectedRow(value);
        loadStaffLazy(value);
    };




    /*
    ======================================== VYMAZANIE AMBULANCIE ================================================================
     */
    /*
      Sluzi na vymazanie ambulancie, vymaze na zaklade cisla izby z tabulky examination_room
   */

    const deleteExaminationRoom = async (rowData) => {
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = {
            authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        };
        const body = JSON.stringify({ EXAMINATION_LOCATION_CODE: rowData.EXAMINATION_LOCATION_CODE });

        fetch(`/examination/delete`, {
            method: 'DELETE',
            headers: headers,
            body: body
        })
            .then((response) => {
                loadExaminationRoomsLazy();


            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle fetch errors here
            });
    };

   /*
        Ak sa nepodari odstranit ambulanciu
    */
    const reject = () => {
        setDialogVisible(false);
        toast.current.show({ severity: 'warn', summary: 'Nie je odstranená', detail: 'Ambulanciu sa nepodarilo odstrániť', life: 5000 });
    }

    /*
       Ak sa podari  odstranit ambulanciu
   */
    const handleAccept = () => {
        setDialogVisible(false);
        deleteExaminationRoom(rowDataDelete);
        toast.current.show({ severity: 'info', summary: 'Odstranená', detail: 'Ambulanciu sa podarilo odstrániť', life: 5000 });

    };

    /*
        Dialogove okno, ked pouzivatel, chce odstranit ambulanciu
     */
    const confirmDelete = (rowData) => {
        setDialogVisible(true);
        setRowDataDelete(rowData)

    };

    /*
       Button, ked pouzivatel, chce odstranit ambulanciu
    */
    const deleteExaminationRoomtAction = (rowData) => (

        <>
            <Toast ref={toast} />
            <ConfirmDialog visible={dialogVisible} onHide={() => setDialogVisible(false)} message="Naozaj si prajete odstrániť ambulanciu?"
                           header="Potvrdenie" icon="pi pi-exclamation-triangle" acceptClassName="p-button-danger" accept={() => handleAccept()} reject={reject} acceptLabel="Áno" rejectLabel="Nie"  />
            <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button  icon="pi pi-times"  className="p-button-danger"  onClick={() => confirmDelete(rowData)} />
            </div>
        </>




    );




    /*
     ======================================== PRACA SO ZDRAVOTNYMI POTREBAMI PRE AMBULANCIU ================================================================
      */

    /*
        Sluzi na upravu poloziek v Supplies
     */
    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        setFormData({ ...formData, [fieldName]: value });
    };

    /*
        Da supllies do pola, kvoli vypisu do tabulky
     */
    const transformedSuppliesArray = Object.keys(actualSupplies).map((key) => ({
        name: key,
        quantity: actualSupplies[key]
    }));


    /*
        Nacita aktualne supplies pre danu ambulanciu
     */
    function loadActualSupplies(rowData) {
        setRowDataAtr(rowData);
        try {
            setExaminationRoomCode(rowData.EXAMINATION_LOCATION_CODE);
            if( typeof rowData.SUPPLIES != 'object') {
                const parsedData = JSON.parse(rowData.SUPPLIES);
               setActualSupplies(parsedData);
            }
            setShowSuppliesDialog(true);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }

    };

    /*
        Tlacidlo na zobrazenie zdravotnych potrieb
     */
    const showSupplies = (rowData) => (
        <Button label="Info" severity="info"  onClick={() => loadActualSupplies(rowData)} />
    );



    /*
        Pridanie novej polozky pre zdravotne potreby
     */
    const addNewSupply = () => {

        const capitalizeFirstLetter = word => word.charAt(0).toUpperCase() + word.slice(1);
        let newItem = formData;
        newItem.name = capitalizeFirstLetter(formData.name);
        let _supplies = [...suppliesArray];
        const isItemExists = _supplies.find(item => {
            return item.name === newItem.name;
        });

        if (isItemExists) {
            toastRef.current.show({
                severity: 'error',
                summary: 'Nie je možné pridať ',
                detail: 'Daná zdravotná pomôcka sa v ambulancii nachádza.',
            });
        } else {
            _supplies.push(newItem);
            setSuppliesArray(_supplies);
            insertSuppliesLazy(formData,examinationRoomCode);
        }

        setFormData({
            name: '',
            quantity: ''
        });
    };

    /*
       odoberanie  polozky zo zdravotnych potrieb
    */
    const deleteSupplyLikeArray = (rowData) => {
        let _supplies = [...suppliesArray];
        //{name: 'tlakomer', quantity: '2'}
        let filteredItems = _supplies.filter(item => !(item.name === rowData.name && item.quantity === rowData.quantity));
       setSuppliesArray(filteredItems);
       deleteSupply(rowData);
    };


    /*
       Sluzi na vymazanie polozky pre zdravotne potreby
    */
    const deleteSupply = async (rowData) => {
        rowData.quantity = null;
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token,'Content-Type': 'application/json' };
        const body =JSON.stringify( {supply: rowData, room:examinationRoomCode});
        fetch(`/examination/supply/delete`, {
            method: 'PUT',
            headers, body
        })
            .then((response) => response.json())
            .then((data) => {

                // Update the state immutably
                setExaminationRooms((prevRooms) => {
                    return prevRooms.map((room) => {
                        if (room.EXAMINATION_LOCATION_CODE === examinationRoomCode) {
                            let locSupplies = { ...JSON.parse(room.SUPPLIES) };
                            let key = rowData.name;

                            // Remove the supply from locSupplies
                            delete locSupplies[key];

                            return { ...room, SUPPLIES: JSON.stringify(locSupplies) };
                        }
                        return room;
                    });
                });

                setLazyLoading(false);
                setReloadDialog((prev) => !prev);

                // Manually force the DataTable to update
                dataTableRef.current && dataTableRef.current.filter();
            });
    };

   /*
        Tlacidlo pre vymazanie polozky pre zdravotne potreby
    */
    const deleteSupplyAction = (rowData) => (
        <Button
            icon="pi pi-times"
            onClick={() => deleteSupplyLikeArray(rowData)}
            className="p-button-danger"
        />
    );

    /*
        Sluzi na aktualizovanie zdravotnych potrieb v ambulancii
     */
    const updateSuppliesLazy = (value, examinationRoomCode) => {
        setLazyLoading(true);
        console.log("Update Supplies in jsx");
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token,'Content-Type': 'application/json' };
        const body =JSON.stringify( {supply: value, room:examinationRoomCode});
        console.log(body);
        fetch(`/examination/supply`, {
            method: 'PUT',
            headers, body
        })
            .then((response) => response.json())
            .then((data) => {

                setExaminationRooms((prevRooms) => {
                    return prevRooms.map((room) => {
                        if (room.EXAMINATION_LOCATION_CODE === examinationRoomCode) {
                            let locSupplies = JSON.parse(room.SUPPLIES);
                            let key = value.name;
                            locSupplies[key] = Number(value.quantity);
                            room.SUPPLIES = JSON.stringify(locSupplies);
                            console.log(room.SUPPLIES);
                            loadActualSupplies(room);
                        }
                        return room;
                    });
                });

                setLazyLoading(false);
                setReloadDialog((prev) => !prev);
                // Manually force the DataTable to update
                dataTableRef.current && dataTableRef.current.filter();


            });

    };

    const insertSuppliesLazy = (value, examinationRoomCode) => {
        setLazyLoading(true);
        console.log("Update Supplies in jsx");
        const token = localStorage.getItem('logged-user');
        const tokenParsedData = GetUserData(token);
        const headers = { authorization: 'Bearer ' + token,'Content-Type': 'application/json' };
        const body =JSON.stringify( {supply: value, room:examinationRoomCode});
        console.log(body);
        fetch(`/examination/supply/insert`, {
            method: 'POST',
            headers, body
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(value);
                console.log(data);
                let rooms = examinationRooms.map((room) => {
                    if (room.EXAMINATION_LOCATION_CODE === examinationRoomCode) {
                        let locSupplies = { ...JSON.parse(room.SUPPLIES) };
                        let key = value.name;
                        locSupplies[key] = Number(value.quantity);
                        return { ...room, SUPPLIES: JSON.stringify(locSupplies) };
                    }
                    return room;
                });
                setExaminationRooms(rooms);
                setLazyLoading(false);
                setReloadDialog((prev) => !prev);

                // Manually force the DataTable to update
                dataTableRef.current && dataTableRef.current.filter();

            })
            .catch((error) => {
                console.error('Error updating item:', error);
                // Handle error and show error message if needed
            });
    };

    /*
        Uprava riadka
     */

    const onRowEditComplete = (e) => {


        let _supplies = [...suppliesArray];
        let { newData, index } = e;
        _supplies[index] = newData;
        console.log(_supplies);
        console.log(e);
        setSuppliesArray(_supplies);
        updateSuppliesLazy(e.newData,examinationRoomCode);



    };
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    /*
           Hlavicka stranky, kde je button pre pridanie novej ambulancie
        */

    const renderHeader = () => {
        return (
            <div className="table-header">
                <span>Ambulancie</span>
                <div className="table-header-right">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
                id="searchInput"
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Vyhľadať..."
            />
          </span>
                    <Link to="/examination-room/form">
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


    /*
        Stlpce pre tabulky
     */
    const columns = [
        { field: 'EXAMINATION_LOCATION_CODE', header: 'Číslo ambulancie', filter: true },
        { field: 'NAME_ROOM', header: 'Názov ambulancie', filter: true },
        { field: 'DEPARTMENT_LOCATION_CODE', header: 'Oddelenie', filter: true },
        { field: 'DOCTOR_ID', header: 'Lekár', filter: true },
        { field: 'NURSE_ID', header: 'Zdravotná sestra', filter: true },
        { field: '', header: '', body: showSupplies, filter: false },
        { field: '', header: '', body: deleteExaminationRoomtAction, filter: false }
    ];

    /*
       template
    */
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



    /*
       Hlavicka pre tabulku
    */
    const header = renderHeader();
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable
                    value={examinationRooms}
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
                        'EXAMINATION_LOCATION_CODE',
                        'NAME_ROOM',
                        'DEPARTMENT_LOCATION_CODE',
                        'DOCTOR_ID',
                    ]}
                    emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
                    virtualScrollerOptions={{
                        lazy: true,
                        onLazyLoad: loadExaminationRoomsLazy,
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



            { /*Dialogove okno pre podrobnejsie info*/}
            <Dialog
                header="Zdravotný personál"
                visible={showDialog}
                style={{ width: '50vw' }}
                onHide={() => onHide()}
            >
                {getNameOfStaff()}



            </Dialog>
            <div className="card flex justify-content-center">
            { /*Dialogove okno pre potreby */}
                <Dialog  key={reloadDialog} header="Zdravotné potreby" visible={showSuppliesDialog} style={{width: '50vw'}}
                        onHide={() => setShowSuppliesDialog(false)}>
                    <Toast ref={toastRef} />



                    <div className="card p-fluid">
                        <DataTable ref={dataTableRef}
                                   value={suppliesArray} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete}  tableStyle={{ minWidth: '30rem' }}>
                            <Column field="name" header="Názov" editor={(options) => textEditor(options)}></Column>
                            <Column field="quantity" header="Množstvo"  editor={(options) => textEditor(options)}></Column>
                            <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                            <Column field="" header="" body= { deleteSupplyAction} ></Column>


                        </DataTable>
                    </div>

                    <div className="flex flex-column gap-2">
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-column">
                                <label htmlFor="name">Názov</label>
                                <InputText id="name" type="text" className="p-inputtext-sm" value={formData.name} onChange={(e) => handleInputChange(e, 'name')} autoComplete="name"/>
                            </div>
                            <div className="flex flex-column">
                                <label htmlFor="quantity">Množstvo</label>
                                <InputText id="quantity" keyfilter="int" type="text" className="p-inputtext-sm" value={formData.quantity} onChange={(e) => handleInputChange(e, 'quantity')} autoComplete="quality"   />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                icon="pi pi-plus"
                                onClick={addNewSupply}
                                autoFocus
                                style={{ padding: '1rem' }}
                            />
                        </div>
                    </div>


                </Dialog>
            </div>
        </div>

    );
}
