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
  padding: 0.9rem 1.25rem 0.9rem 2.5rem;
  align-items: center;
  box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.15);
  // background: ${props => props.theme.palette.error.main};
  color: white;
`;

export const ErrorAlert = props => (
  <StyledAlert icon={<Warning fontSize="inherit" />} variant="filled" severity="error" {...props} />
);

export const SuccessAlert = props => (
  <StyledAlert
    icon={<Warning fontSize="inherit" />}
    variant="filled"
    severity="success"
    {...props}
  />
);

export const LightSuccessAlert = styled(SuccessAlert)`
  background: ${props => props.theme.palette.success.light};
  color: ${props => props.theme.palette.success.light};
`;

export const LightErrorAlert = styled(ErrorAlert)`
  background: ${props => props.theme.palette.error.light};
  color: ${props => props.theme.palette.error.main};
`;

export const SmallErrorAlert = styled(ErrorAlert)`
  font-size: 0.8125rem;
  border-radius: 3px;
  padding: 0.5rem 1.25rem 0.5rem 1rem;
  box-shadow: none;

  .MuiAlert-icon {
    padding: 0.5rem 0;
    margin-right: 0.5rem;
    font-size: 1.5em;
  }
`;

export const SmallLightErrorAlert = styled(SmallErrorAlert)`
  background: ${props => props.theme.palette.error.light};
  color: ${props => props.theme.palette.error.main};
`;