/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns';
import PropTypes from 'prop-types';
import auLocale from "date-fns/locale/en-AU";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { KeyboardDatePicker as MuiDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { TextField } from './TextField';
import { DAY_MONTH_YEAR_DATE_FORMAT } from '../../constants';

const StyledDatePicker = styled(MuiDatePicker)`
  .MuiInputBase-input {
    padding-left: 0;
    color: ${props => props.theme.palette.text.tertiary};
  }

  .MuiButtonBase-root.MuiIconButton-root {
    top: -1px;
    color: ${props => props.theme.palette.text.tertiary};
    padding: 0.5rem;
  }
`;

export const DatePicker = ({ value, onChange, ...props }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={auLocale}>
      <StyledDatePicker
        value={value}
        format={DAY_MONTH_YEAR_DATE_FORMAT}
        keyboardIcon={<CalendarTodayIcon />}
        InputAdornmentProps={{ position: 'start' }}
        onChange={onChange}
        animateYearScrolling
        TextFieldComponent={TextField}
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
};

DatePicker.defaultProps = {
  value: new Date(),
};
