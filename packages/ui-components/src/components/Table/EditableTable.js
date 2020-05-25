/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField } from '../Inputs';

const EditableTextField = styled(TextField)`
  margin: 0;
  position: relative;
  right: 1px;

  .MuiInputBase-input {
    text-align: center;
    font-size: 15px;
    line-height: 18px;
    padding: 0.5rem;
  }
`;

const ReadOnlyTextField = styled(EditableTextField)`
  .MuiInputBase-root {
    background: none;
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: none;
    box-shadow: none;
  }
`;

export const EditableTableContext = createContext({});

const EditableCell = React.memo(({ id, columnKey }) => {
  const { fields, handleFieldChange, tableState } = useContext(EditableTableContext);
  const key = `${id}-${columnKey}`;
  if (tableState === 'editable') {
    return (
      <EditableTextField
        name={columnKey}
        value={fields[key]}
        onChange={handleFieldChange}
        id={key}
        key={key}
      />
    );
  }

  return (
    <ReadOnlyTextField
      name="cases"
      value={fields[key]}
      onChange={handleFieldChange}
      id={key}
      InputProps={{ readOnly: true }}
    />
  );
});

EditableCell.propTypes = {
  id: PropTypes.string.isRequired,
  columnKey: PropTypes.string.isRequired,
};

/*
 * Make the editable data into a a flat object of key value paris
 */
const makeInitialFormState = (columns, data) => {
  return columns.reduce((state, column) => {
    if (column.editable) {
      const newState = state;
      data.forEach(row => {
        const key = `${row.id}-${column.key}`;
        newState[key] = row[column.key];
      });

      return newState;
    }

    return state;
  }, {});
};

/*
 * Add the EditableCell Cell Component to columns marked as editable
 */
const makeEditableColumns = columns => {
  return columns.map(column => {
    if (column.editable) {
      return { ...column, CellComponent: EditableCell };
    }

    return column;
  });
};

const useFormFields = initialState => {
  const [fields, setValues] = useState(initialState);
  return [
    fields,
    event => {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
    setValues,
  ];
};

export const EditableTableProvider = React.memo(
  ({ columns, data, tableState, initialMetadata, children }) => {
    const initialState = makeInitialFormState(columns, data);
    const editableColumns = makeEditableColumns(columns);
    const [fields, handleFieldChange, setValues] = useFormFields(initialState);
    const [metadata, setMetadata] = useState(initialMetadata);

    useEffect(() => {
      // loading must change after initial state is set
      if (tableState === 'loading') {
        setValues(initialState);
        setMetadata(initialMetadata);
      }
    }, [data]);

    return (
      <EditableTableContext.Provider
        value={{
          fields,
          handleFieldChange,
          tableState,
          editableColumns,
          data,
          metadata,
          setMetadata,
        }}
      >
        {children}
      </EditableTableContext.Provider>
    );
  },
);

EditableTableProvider.propTypes = {
  tableState: PropTypes.PropTypes.oneOf(['static', 'editable', 'loading']).isRequired,
  children: PropTypes.any.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.node.isRequired,
      accessor: PropTypes.func,
      editable: PropTypes.bool,
      CellComponent: PropTypes.any,
      sortable: PropTypes.bool,
    }),
  ).isRequired,
  data: PropTypes.array.isRequired,
  initialMetadata: PropTypes.object,
};

EditableTableProvider.defaultProps = {
  initialMetadata: {},
};
