import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import MedicalRecordTable from 'tables/MedicalRecordTable';
import PatientPrescriptionsTable from 'tables/PatientPrescriptionsTable';
import PatientVaccinationTable from 'tables/PatientVaccinationTable';

export default function PatientProfile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { state } = useLocation();

  return (
    <TabView
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <TabPanel header="Vypísané recepty">
        <PatientPrescriptionsTable
          patientId={state}
        ></PatientPrescriptionsTable>
      </TabPanel>
      <TabPanel header="Vakcinácie">
        <PatientVaccinationTable patientId={state}></PatientVaccinationTable>
      </TabPanel>
      <TabPanel header="Appointmenty"></TabPanel>
      <TabPanel header="Záznamy">
        <MedicalRecordTable patientId={state}></MedicalRecordTable>
      </TabPanel>
    </TabView>
  );
}
