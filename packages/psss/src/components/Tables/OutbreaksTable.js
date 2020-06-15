/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import { ConnectedTable } from './ConnectedTable';
import {
  AlertMenuCell,
  CountryNameCell,
  StartDateCell,
  WeekAndDateCell,
} from './TableCellComponents';

const columns = [
  {
    title: 'Country',
    key: 'name',
    width: '26%',
    align: 'left',
    CellComponent: CountryNameCell,
  },
  {
    title: 'Diagnosis',
    key: 'diagnosis',
    align: 'left',
  },
  {
    title: 'Alert Start Date',
    key: 'week',
    align: 'left',
    width: '220px',
    CellComponent: WeekAndDateCell,
  },
  {
    title: 'Outbreak Start Date',
    key: 'outbreakStartDate',
    align: 'left',
    CellComponent: StartDateCell,
  },
  {
    title: 'Cases Since Alert Began',
    key: 'totalCases',
    align: 'left',
    width: '125px',
  },
  {
    title: 'Total Lab Confirmed Cases',
    key: 'totalLabCases',
    align: 'left',
    width: '140px',
  },
  {
    title: '',
    key: 'id',
    sortable: false,
    CellComponent: AlertMenuCell,
    width: '70px',
  },
];

export const OutbreaksTable = React.memo(() => (
  <ConnectedTable endpoint="outbreaks" columns={columns} />
));