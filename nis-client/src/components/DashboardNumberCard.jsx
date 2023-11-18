import { Card } from 'primereact/card';
import React from 'react';

export default function DashboardNumberCard(props) {
  return (
    <>
      <Card title={props.title}>{props.content}</Card>
    </>
  );
}
