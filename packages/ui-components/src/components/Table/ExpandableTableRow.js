/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import MuiTable from '@material-ui/core/Table';
import MuiTableRow from '@material-ui/core/TableRow';
import MuiTableBody from '@material-ui/core/TableBody';
import styled from 'styled-components';
import MuiTableCell from '@material-ui/core/TableCell';
import { tableColumnShape } from './tableColumnShape';
import { TableRowCells, StyledTableRow } from './TableRow';

const WrapperCell = styled(MuiTableCell)`
  background: white;
  padding: 0;
  border: 1px solid ${props => props.theme.palette.grey['400']};
  box-sizing: border-box;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);

  .MuiTableRow-root {
    &:hover {
      background: ${props => props.theme.palette.common.white};
    }
  }
`;

const StyledTable = styled(MuiTable)`
  border-collapse: unset;
  table-layout: fixed;
`;

export const TableRowExpansionContainer = React.memo(
  ({ parentRow, children, colSpan, className }) => (
    <MuiTableRow className={className}>
      <WrapperCell colSpan={colSpan}>
        <StyledTable>
          <MuiTableBody>{parentRow}</MuiTableBody>
        </StyledTable>
        {children}
      </WrapperCell>
    </MuiTableRow>
  ),
);

TableRowExpansionContainer.propTypes = {
  colSpan: PropTypes.number.isRequired,
  parentRow: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
};

TableRowExpansionContainer.defaultProps = {
  className: '',
};

export const ExpandableTableRow = React.memo(
  ({ columns, data, rowIndex, className, SubComponent }) => {
    const [expanded, setExpanded] = useState(false);

    const handleClick = useCallback(() => {
      setExpanded(prevExpanded => !prevExpanded);
    }, []);

    const row = (
      <StyledTableRow className={className} onClick={handleClick}>
        <TableRowCells columns={columns} rowData={data[rowIndex]} />
      </StyledTableRow>
    );

    if (SubComponent && expanded) {
      return (
        <TableRowExpansionContainer parentRow={row} colSpan={columns.length}>
          <SubComponent data={data} />
        </TableRowExpansionContainer>
      );
    }

    return row;
  },
);

ExpandableTableRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape(tableColumnShape)).isRequired,
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number.isRequired,
  SubComponent: PropTypes.any,
  className: PropTypes.string,
};

ExpandableTableRow.defaultProps = {
  SubComponent: PropTypes.null,
  className: '',
};

export const ControlledExpandableTableRow = ({
  columns,
  data,
  rowIndex,
  className,
  expanded,
  onClick,
  SubComponent,
  ExpansionContainer,
}) => {
  console.log('expanded', expanded);
  const row = (
    <StyledTableRow className={className} onClick={onClick}>
      <TableRowCells columns={columns} rowData={data[rowIndex]} />
    </StyledTableRow>
  );

  if (SubComponent && expanded) {
    return (
      <ExpansionContainer parentRow={row} colSpan={columns.length}>
        <SubComponent rowData={data[rowIndex]} />
      </ExpansionContainer>
    );
  }

  return row;
};

ControlledExpandableTableRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape(tableColumnShape)).isRequired,
  data: PropTypes.array.isRequired,
  rowIndex: PropTypes.number.isRequired,
  className: PropTypes.string,
  expanded: PropTypes.bool,
  SubComponent: PropTypes.any,
  ExpansionContainer: PropTypes.any,
};

ControlledExpandableTableRow.defaultProps = {
  className: '',
  expanded: false,
  SubComponent: PropTypes.null,
  ExpansionContainer: TableRowExpansionContainer,
};
