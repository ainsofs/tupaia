/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { modelClasses } from '@tupaia/database';
import { Service } from '../Service';
import { getServerName, getDhisApiInstance } from './getDhisApiInstance';
const { DataSource } = modelClasses;

export class DhisService extends Service {
  constructor(...args) {
    super(...args);
    this.pushers = {
      [DataSource.types.dataElement]: this.pushAggregateData.bind(this),
      [DataSource.types.dataGroup]: this.pushEvent.bind(this),
    };

    this.deleters = {
      [DataSource.types.dataElement]: this.deleteAggregateData.bind(this),
      [DataSource.types.dataGroup]: this.deleteEvent.bind(this),
    };
  }

  getApiForEntity(entityCode) {
    const serverName = getServerName(entityCode, this.dataSource.config.isDataRegional);
    return getDhisApiInstance({ serverName });
  }

  /**
   *
   * @param {Object}     dataValue    The untranslated data value
   * @param {DataSource} dataSource   Note that this may not be the instance's primary data source
   */
  translateDataValueCode = ({ code, ...restOfDataValue }, dataSource) => {
    return {
      dataElement: dataSource.config.dataElementCode || dataSource.code,
      ...restOfDataValue,
    };
  };

  async translateEventDataValues(dataValues) {
    const dataSources = await this.models.dataSource.fetchManyFromDbOrDefault(
      dataValues.map(({ code }) => code),
    );
    const dataValuesWithCodeReplaced = dataValues.map((d, i) =>
      this.translateDataValueCode(d, dataSources[i]),
    );
    const dataElementCodes = dataValuesWithCodeReplaced.map(({ dataElement }) => dataElement);
    const dataElementIds = await this.api.getIdsFromCodes(
      this.api.resourceTypes.DATA_ELEMENT,
      dataElementCodes,
    );
    const dataValuesWithIds = dataValuesWithCodeReplaced.map((d, i) => ({
      ...d,
      dataElement: dataElementIds[i],
    }));
    return dataValuesWithIds;
  }

  async push(data) {
    const api = this.getApiForEntity(data.orgUnit);
    const pushData = this.pushers[this.dataSource.type];
    const diagnostics = await pushData(api, data);
    return { diagnostics, serverName: api.getServerName() };
  }

  async pushAggregateData(api, dataValue) {
    const translatedDataValue = await this.translateDataValueCode(dataValue, this.dataSource);
    return api.postDataValueSets([translatedDataValue]);
  }

  async pushEvent(api, { dataValues, ...restOfEvent }) {
    const translatedDataValues = await this.translateEventDataValues(dataValues);
    const event = { dataValues: translatedDataValues, ...restOfEvent };
    return api.postEvents([event]);
  }

  async delete(data, { serverName }) {
    const api = getDhisApiInstance({ serverName });
    const deleteData = this.deleters[this.dataSource.type];
    return deleteData(api, data);
  }

  async deleteAggregateData(api, dataValue) {
    const translatedDataValue = this.translateDataValueCode(dataValue, this.dataSource);
    return api.deleteDataValue(translatedDataValue);
  }

  deleteEvent = async (api, data) => api.deleteEvent(data.dhisReference);

  async pull(metadata) {
    const api = this.getApiForEntity(metadata.entityCode);
    // TODO implement
  }
}
