/**
 * Tupaia MediTrak
 * Copyright (c) 2018 Beyond Essential Systems Pty Ltd
 */

export const convertSearchTermToFilter = (unprocessedFilterObject = {}) => {
  const filterObject = {};
  Object.entries(unprocessedFilterObject).forEach(([key, value]) => {
    filterObject[key] = {
      comparator: 'LIKE',
      comparisonValue: `${value}%`,
      ignoreCase: true,
    };
  });
  return filterObject;
};
