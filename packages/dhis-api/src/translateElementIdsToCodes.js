/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { mapKeys, reduceToDictionary } from '@tupaia/utils';
import { DHIS2_RESOURCE_TYPES } from './types';

export const translateElementIdsToCodesInEvents = async (dhisApi, events) => {
  const ids = events.reduce(
    (allIds, event) => allIds.concat(event.dataValues.map(({ dataElement }) => dataElement)),
    [],
  );
  const dataElements = await dhisApi.getRecords({
    ids,
    fields: ['id', 'code'],
    type: DHIS2_RESOURCE_TYPES.DATA_ELEMENT,
  });
  const dataElementIdToCode = reduceToDictionary(dataElements, 'id', 'code');

  return events.map(({ dataValues, ...restOfEvent }) => ({
    ...restOfEvent,
    dataValues: dataValues.map(value => ({
      ...value,
      dataElement: dataElementIdToCode[value.dataElement],
    })),
  }));
};

export const translateElementIdsToCodesInEventAnalytics = async (
  eventAnalytics,
  dataElementIdToCode,
) => {
  const { headers, metaData, ...otherProps } = eventAnalytics;

  const translatedHeaders = headers.map(({ name, ...otherHeaderProps }) => {
    const isDataElement = !!dataElementIdToCode[name];
    const translatedName = isDataElement ? dataElementIdToCode[name] : name;

    return {
      ...otherHeaderProps,
      name: translatedName,
    };
  });

  const translatedMetaData = {
    ...metaData,
    items: mapKeys(metaData.items, dataElementIdToCode, {
      defaultToExistingKeys: true,
    }),
    dimensions: mapKeys(metaData.dimensions, dataElementIdToCode, {
      defaultToExistingKeys: true,
    }),
  };

  return {
    headers: translatedHeaders,
    metaData: translatedMetaData,
    ...otherProps,
  };
};
