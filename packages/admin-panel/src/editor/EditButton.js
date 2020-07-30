/**
 * Tupaia MediTrak
 * Copyright (c) 2018 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '../widgets';
import { openEditModal } from './actions';

export const EditButtonComponent = ({ dispatch, value: recordId, actionConfig }) => (
  <IconButton onClick={() => dispatch(openEditModal(actionConfig, recordId))}>
    <EditIcon />
  </IconButton>
);

EditButtonComponent.propTypes = {
  actionConfig: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export const EditButton = connect()(EditButtonComponent);
