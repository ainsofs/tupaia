/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import MuiLink from '@material-ui/core/Link';
import styled from 'styled-components';
import {
  ExpandableTableBody,
  Table,
  GreyOutlinedButton,
  Button,
  FakeHeader,
} from '@tupaia/ui-components';
import { VerifiableTableRow } from './VerifiableTableRow';
import { BorderlessTableRow } from './TableTypes';
import { EditableTableContext } from './EditableTable';

const VerifiableBody = props => {
  const { tableState } = useContext(EditableTableContext);
  const Row = tableState === 'editable' ? BorderlessTableRow : VerifiableTableRow;
  return <ExpandableTableBody TableRow={Row} {...props} />;
};

const LayoutRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
`;

const GreyHeader = styled(FakeHeader)`
  border: none;
`;

export const VerifiableTable = ({ tableState, setTableState }) => {
  const { editableColumns, data, fields, metadata } = useContext(EditableTableContext);

  const handleEdit = () => {
    setTableState('editable');
  };

  const handleCancel = () => {
    setTableState('static');
  };

  const handleSubmit = () => {
    // POST DATA
    console.log('updated values...', fields, metadata);
    setTableState('static');
  };

  return (
    <React.Fragment>
      <LayoutRow>
        <Typography variant="h5">7/10 Sites Reported</Typography>
        <GreyOutlinedButton onClick={handleEdit} disabled={tableState === 'editable'}>
          Edit
        </GreyOutlinedButton>
      </LayoutRow>
      <GreyHeader>
        <span>SYNDROMES</span>
        <span>TOTAL CASES</span>
      </GreyHeader>
      <Table Header={false} Body={VerifiableBody} columns={editableColumns} data={data} />
      {tableState === 'editable' && (
        <LayoutRow>
          <MuiLink>Reset and use Sentinel data</MuiLink>
          <div>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </LayoutRow>
      )}
    </React.Fragment>
  );
};

VerifiableTable.propTypes = {
  tableState: PropTypes.string.isRequired,
  setTableState: PropTypes.func.isRequired,
};
