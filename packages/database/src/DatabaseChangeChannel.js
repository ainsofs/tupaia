/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import PGPubSub from 'pg-pubsub';

import { getConnectionConfig } from './getConnectionConfig';

export class DatabaseChangeChannel extends PGPubSub {
  constructor() {
    super(getConnectionConfig());
  }

  addChangeHandler(handler) {
    this.addChannel('change', handler);
  }

  publishRecordUpdates(recordType, records, specificHandlerKey) {
    records.forEach(record =>
      this.publish('change', {
        record_id: record.id,
        type: 'update',
        record_type: recordType,
        handler_key: specificHandlerKey,
      }),
    );
  }
}
