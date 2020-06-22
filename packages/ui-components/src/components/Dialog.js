/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import PropTypes from 'prop-types';
import MuiDialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import { IconButton } from './IconButton';

const backdropColor = 'rgba(65, 77, 85, 0.3)';

const StyledDialog = styled(MuiDialog)`
  .MuiBackdrop-root {
    background: ${backdropColor};
  }
`;

export const Dialog = ({ children, ...props }) => (
  <StyledDialog fullWidth maxWidth="sm" {...props}>
    {children}
  </StyledDialog>
);

Dialog.propTypes = {
  children: PropTypes.array.isRequired,
};

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.3rem 1.875rem 1.25rem;
  border-bottom: 1px solid ${props => props.theme.palette.grey['400']};
`;

const DialogTitle = styled(Typography)`
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: ${props => props.theme.palette.text.primary};
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  color: ${props => props.theme.palette.text.primary};
`;

export const DialogHeader = ({ title, onClose }) => (
  <Header>
    <DialogTitle variant="h3">{title}</DialogTitle>
    <CloseButton onClick={onClose}>
      <CloseIcon />
    </CloseButton>
  </Header>
);

DialogHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export const DialogContent = styled.div`
  padding: 2.5rem 1.875rem;
  background-color: #f9f9f9;
  text-align: center;
`;

export const DialogFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1.1rem 1.875rem;
  background-color: #f9f9f9;
  border-top: 1px solid ${props => props.theme.palette.grey['400']};
`;