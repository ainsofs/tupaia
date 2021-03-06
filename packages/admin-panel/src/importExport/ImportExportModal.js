/**
 * Tupaia MediTrak
 * Copyright (c) 2018 Beyond Essential Systems Pty Ltd
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogFooter, DialogHeader, OutlinedButton } from '@tupaia/ui-components';
import { connect } from 'react-redux';
import { dismissDialog } from './actions';
import { ModalContentProvider, InputField } from '../widgets';

export const ImportExportModalComponent = ({
  isLoading,
  errorMessage,
  onDismiss,
  title,
  isConfirmDisabled,
  onConfirm,
  confirmLabel,
  queryParameters,
  subtitle,
  children,
  parentRecord,
  isOpen,
}) => {
  const [values, setValues] = useState({});

  const handleValueChange = (key, value) => {
    setValues(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  // clear form state when modal is opened or closed
  useEffect(() => {
    setValues({});
  }, [isOpen]);

  const checkVisibilityCriteriaAreMet = visibilityCriteria => {
    if (!visibilityCriteria) {
      return true; // no visibility criteria to meet, fine to display
    }
    return Object.entries(visibilityCriteria).every(
      ([parameterKey, requiredValue]) => values[parameterKey] === requiredValue,
    );
  };

  return (
    <Dialog onClose={onDismiss} open={isOpen} disableBackdropClick>
      <DialogHeader
        onClose={onDismiss}
        title={errorMessage ? 'Error' : title}
        color={errorMessage ? 'error' : 'textPrimary'}
      />
      <ModalContentProvider errorMessage={errorMessage} isLoading={isLoading}>
        <p>{subtitle}</p>
        {queryParameters
          .filter(({ visibilityCriteria }) => checkVisibilityCriteriaAreMet(visibilityCriteria))
          .map(queryParameter => {
            const { parameterKey, label, secondaryLabel } = queryParameter;
            return (
              <InputField
                key={parameterKey}
                inputKey={parameterKey}
                value={values[parameterKey]}
                {...queryParameter}
                onChange={handleValueChange}
                label={label}
                secondaryLabel={secondaryLabel}
                parentRecord={parentRecord}
              />
            );
          })}
        {children}
      </ModalContentProvider>
      <DialogFooter>
        <OutlinedButton onClick={onDismiss} disabled={isLoading}>
          {errorMessage ? 'Dismiss' : 'Cancel'}
        </OutlinedButton>
        <Button
          onClick={() => onConfirm(values)}
          disabled={!!errorMessage || isLoading || isConfirmDisabled}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

ImportExportModalComponent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  isConfirmDisabled: PropTypes.bool,
  children: PropTypes.node,
  queryParameters: PropTypes.array,
  parentRecord: PropTypes.object,
};

ImportExportModalComponent.defaultProps = {
  errorMessage: null,
  title: null,
  queryParameters: [],
  subtitle: '',
  isConfirmDisabled: false,
  parentRecord: {},
  children: null,
};

const mapStateToProps = ({ importExport: importExportState }, { onConfirm }) => {
  const { isLoading, parentRecord } = importExportState;

  return {
    isLoading,
    parentRecord,
    onConfirm: values => onConfirm(values, parentRecord),
  };
};

const mapDispatchToProps = dispatch => ({
  onDismiss: () => dispatch(dismissDialog()),
});

export const ImportExportModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportExportModalComponent);
