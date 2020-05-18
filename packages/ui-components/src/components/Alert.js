/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import styled from 'styled-components';
import { Warning } from '@material-ui/icons';

const StyledAlert = styled(MuiAlert)`
  border-radius: 0;
  font-weight: 400;
  padding: 15px 20px 14px 40px;
  align-items: center;
  box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.15);
`;

const StyledErrorAlert = styled(StyledAlert)`
  background: ${props => props.theme.palette.error.light};
  color: ${props => props.theme.palette.error.main};
`;

export const ErrorAlert = props => (
  <StyledErrorAlert
    icon={<Warning fontSize="inherit" />}
    variant="filled"
    severity="error"
    {...props}
  />
);
