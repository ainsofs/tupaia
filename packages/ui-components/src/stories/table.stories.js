/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import { SimpleTable, ZebraTable, CardTable } from '../components/Table';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';

export default {
  title: 'Table',
};

const Container = styled.div`
  max-width: 360px;
  margin: 1rem;
`;

export const Table = () => <SimpleTable />;

export const zebraTable = () => (
  <Box p={3}>
    <ZebraTable />
  </Box>
);

export const cardTable = () => (
  <Container>
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Total cases from previous week
        </Typography>
        <CardTable />
      </CardContent>
    </Card>
  </Container>
);