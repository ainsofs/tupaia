import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { DatePicker } from './DatePicker';
import { GRANULARITY_CONFIG, GRANULARITIES } from '../../utils/periodGranularities';

const { pickerFormat: FORMAT } = GRANULARITY_CONFIG[GRANULARITIES.WEEK];

const useBoundaryWeekOrDefault = (currentDate, boundaryDate, defaultWeek) =>
  currentDate.isoWeekYear() === boundaryDate.isoWeekYear() ? boundaryDate.isoWeek() : defaultWeek;

export const WeekPicker = props => {
  const { momentDateValue, minMomentDate, maxMomentDate, onChange } = props;
  const date = momentDateValue.isoWeekday(1);

  const weeksInYear = date.isoWeeksInYear();
  const minAvailableWeekIndex = useBoundaryWeekOrDefault(date, minMomentDate, 1);
  const maxAvailableWeekIndex = useBoundaryWeekOrDefault(date, maxMomentDate, weeksInYear);

  const menuItems = [];
  // Prefer moment mutation to creation for performance reasons
  const mutatingMoment = date.clone();
  for (let w = 1; w <= weeksInYear; w++) {
    const week = mutatingMoment.isoWeek(w).format(FORMAT);
    const disabled = w < minAvailableWeekIndex || w > maxAvailableWeekIndex;

    menuItems.push(
      <MenuItem value={w} key={w} disabled={disabled}>
        {week}
      </MenuItem>,
    );
  }

  return (
    <DatePicker
      label="Week"
      selectedValue={date.isoWeek()}
      menuItems={menuItems}
      onChange={e => onChange(date.clone().isoWeek(e.target.value))}
      getFormattedValue={weekIndex => date.isoWeek(weekIndex).format(FORMAT)}
    />
  );
};

WeekPicker.propTypes = {
  momentDateValue: PropTypes.instanceOf(moment).isRequired,
  minMomentDate: PropTypes.instanceOf(moment).isRequired,
  maxMomentDate: PropTypes.instanceOf(moment).isRequired,
  onChange: PropTypes.func.isRequired,
};
