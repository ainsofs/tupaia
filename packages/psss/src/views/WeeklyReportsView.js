/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import styled from 'styled-components';
import MuiContainer from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { TableView } from './TableView';

const Main = styled.main`
  background: lightgray;
  padding-top: 1rem;
`;

const Container = styled(MuiContainer)`
  min-height: 800px;
`;

const countries = [
  { name: 'Samoa', url: 'samoa' },
  { name: 'Fiji', url: 'fiji' },
  { name: 'Kiribati', url: 'kiribati' },
  { name: 'Tonga', url: 'tonga' },
  { name: 'Tuvalu', url: 'tuvalu' },
  { name: 'Vanuatu', url: 'vanuatu' },
];

const config = {
  resource: 'base-url/resources/home-page',
};

export const WeeklyReportsView = () => {
  return (
    <Main>
      <Container>
        <Typography variant="h2" gutterBottom>
          Countries Layout
        </Typography>
        <ul>
          {countries.map(country => (
            <li key={country.url}>
              <Link to={`weekly-reports/${country.url}`}>{country.name}</Link>
            </li>
          ))}
        </ul>
        <TableView config={config} />
      </Container>
    </Main>
  );
};
