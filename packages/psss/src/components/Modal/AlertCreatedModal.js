/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import {
  WarningButton,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  WarningCloud,
} from '@tupaia/ui-components';
import Typography from '@material-ui/core/Typography';
import * as COLORS from '../../constants/colors';

const Container = styled.div`
  text-align: center;
  margin: 1rem 0 3rem;
`;

const Icon = styled(WarningCloud)`
  font-size: 3rem;
  color: ${COLORS.RED};
  margin-bottom: 1rem;
`;

const Heading = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const Copy = styled(Typography)`
  font-size: 18px;
  line-height: 21px;
  margin-bottom: 1rem;
`;

const Link = styled(RouterLink)`
  text-decoration: underline;
  font-size: 18px;
  line-height: 21px;
  color: ${COLORS.RED};
`;

export const AlertCreatedModal = ({ isOpen, handleClose }) => (
  <Dialog onClose={handleClose} open={isOpen}>
    <DialogHeader onClose={handleClose} title="Alert created" color="error" />
    <DialogContent>
      <Container>
        <Icon />
        <Heading variant="h6">Alert has been crated</Heading>
        <Copy>Syndrome is above the threshold and an Alert has been created.</Copy>
        <Link to="alerts">View alert: Influenza-like Illness (ILI) - W9</Link>
      </Container>
    </DialogContent>
    <DialogFooter>
      <WarningButton onClick={handleClose}>Close</WarningButton>
    </DialogFooter>
  </Dialog>
);

AlertCreatedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
