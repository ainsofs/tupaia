/**
 * Tupaia MediTrak
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd
 */
import { TYPES } from '@tupaia/database';

import { generateValueOfType, generateTestId } from '../random';
import { ENTITY_TYPES } from '../../../database/models/Entity';

const { ENTITY, SURVEY_RESPONSE } = TYPES;

const CUSTOM_DUMMY_VALUES = {
  [ENTITY]: {
    type: ENTITY_TYPES.FACILITY, // default testing entity should be facility
    country_code: 'DL', // use demo land by default in testing
  },
  [SURVEY_RESPONSE]: {
    timezone: 'Africa/Abidjan', // equivalent to GMT
  },
};

const processDefaultValue = defaultValue => {
  const [preColonValue, type] = defaultValue.split('::');
  const value = preColonValue.replace(/^'/, '').replace(/'$/, '');

  // handle exceptional types
  switch (type) {
    case 'jsonb':
      return JSON.parse(value);
    case 'text[]':
      return value === '{}' ? [] : value.substring(1, value.length - 1).split(','); // '{a,b}' -> [ 'a', 'b' ]
    case 'text, clock_timestamp()) * (1000)':
      return Date.now();
    default:
      return value;
  }
};

export const generateDummyRecord = async (model, overrides = {}) => {
  const schema = await model.fetchSchema();
  const dummyRecord = {};
  Object.entries(schema).forEach(([fieldName, columnInfo]) => {
    const getValue = () => {
      // in order of precedence, we want to use:
      // - the value passed in explicitly in overrides, generally hard coded for the specific test
      if (overrides[fieldName] !== undefined) return overrides[fieldName];
      // - the value stored in CUSTOM_DUMMY_VALUES, even if that is 'null'
      const { databaseType } = model;
      if (
        CUSTOM_DUMMY_VALUES[databaseType] &&
        CUSTOM_DUMMY_VALUES[databaseType][fieldName] !== undefined
      )
        return CUSTOM_DUMMY_VALUES[databaseType][fieldName];
      // - the default value from the database schema
      if (columnInfo.defaultValue !== null) return processDefaultValue(columnInfo.defaultValue);
      // - a test id if the field name indicates that's what it should get
      if (fieldName === 'id') return generateTestId();
      // - null if this is a foreign key and has not been explicitly defined by the user
      if (fieldName.endsWith('_id')) return null;
      // - generate a sensible value based on the database column type
      return generateValueOfType(columnInfo.type, columnInfo);
    };
    dummyRecord[fieldName] = getValue();
  });
  return dummyRecord;
};