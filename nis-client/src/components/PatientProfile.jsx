import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import PatientPrescriptionsTable from 'tables/PatientPrescriptionsTable';

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
      <TabPanel header="Vakcinácie"></TabPanel>
      <TabPanel header="Appointmenty"></TabPanel>
    </TabView>
  );
}
