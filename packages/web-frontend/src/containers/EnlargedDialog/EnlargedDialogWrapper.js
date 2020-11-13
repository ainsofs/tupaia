/**
 * Tupaia Config Server
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { closeEnlargedDialog } from '../../actions';
import { EnlargedDialog } from './EnlargedDialog';

const EnlargedDialogWrapperComponent = ({ isVisible, onCloseOverlay }) => {
  if (!isVisible) {
    // Use open prop on material ui prop rather than returning null here. (ideally, dw if it's hard)
    return null;
  }

  return <EnlargedDialog onCloseOverlay={onCloseOverlay} />;
};

EnlargedDialogWrapperComponent.propTypes = {
  isVisible: PropTypes.bool,
  onCloseOverlay: PropTypes.func.isRequired,
};

EnlargedDialogWrapperComponent.defaultProps = {
  isVisible: false,
};

const mapStateToProps = state => ({
  isVisible: state.enlargedDialog.isVisible,
});

const mapDispatchToProps = dispatch => ({
  onCloseOverlay: () => dispatch(closeEnlargedDialog()),
});

export const EnlargedDialogWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnlargedDialogWrapperComponent);