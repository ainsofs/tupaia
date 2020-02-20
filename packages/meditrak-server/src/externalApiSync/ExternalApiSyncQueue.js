/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 **/
import autobind from 'react-autobind';
import { getIsProductionEnvironment } from '../devops';

const LOWEST_PRIORITY = 5;
const BAD_REQUEST_LIMIT = 7;
const MAX_CHANGES_PER_BATCH = 20000; // breaks in production at around 50k changes

export class ExternalApiSyncQueue {
  constructor(
    models,
    validator,
    subscriptionTypes = [],
    detailGenerator,
    syncQueueModel,
    sideEffectHandler,
    syncQueueKey,
  ) {
    autobind(this);
    this.models = models;
    this.validator = validator;
    this.syncQueueModel = syncQueueModel;
    this.detailGenerator = detailGenerator;
    this.sideEffectHandler = sideEffectHandler;
    this.unprocessedChanges = [];
    this.isProcessing = false;
    subscriptionTypes.forEach(type =>
      models.addChangeHandlerForCollection(type, this.add, syncQueueKey),
    );
  }

  /**
   * Adds a change to the sync queue, ready to be synced to the aggregation server
   */
  add = async change => {
    this.unprocessedChanges.push(change);
    if (!this.isProcessing) this.processChangesIntoDb();
  };

  async persistToSyncQueue(changes, changeDetails) {
    console.log('Persisting', changes.length);
    await Promise.all(
      changes.map(async (change, i) => {
        const changeRecord = {
          ...change,
          // Reset defaults in case this has already been on the sync queue for a while
          is_deleted: false,
          is_dead_letter: false,
          priority: 1,
          change_time: Math.random(), // Force an update, after which point the trigger will update the change_time to more complicated now() + sequence
        };
        if (changeDetails) {
          changeRecord.details = changeDetails[i];
        }
        await this.syncQueueModel.updateOrCreate(
          {
            record_id: change.record_id,
          },
          changeRecord,
        );
      }),
    );
  }

  triggerSideEffects = async changes => {
    if (this.sideEffectHandler) {
      await this.sideEffectHandler.triggerSideEffects(changes);
    }
  };

  processDeletes = async changes => {
    const validDeletes = await this.validator.getValidDeletes(changes);
    console.log('Got', validDeletes.length, 'valid deletes');
    return this.persistToSyncQueue(validDeletes);
  };

  processUpdates = async changes => {
    const validUpdates = await this.validator.getValidUpdates(changes);
    console.log('Got', validUpdates.length, 'valid updates', validUpdates[0]);
    const changeDetails = await this.detailGenerator.generateDetails(validUpdates);
    console.log('Generated', changeDetails.length, 'change details');
    return this.persistToSyncQueue(validUpdates, changeDetails);
  };

  processChangesIntoDb = async () => {
    this.isProcessing = true;
    const changes = this.unprocessedChanges.slice(0, MAX_CHANGES_PER_BATCH);
    this.unprocessedChanges = this.unprocessedChanges.slice(MAX_CHANGES_PER_BATCH);
    const changesSeen = new Set();
    const getChangeHash = ({ record_id: recordId, type }) => `${recordId}: ${type}`;
    const uniqueChanges = changes.filter(change => {
      const hash = getChangeHash(change);
      if (changesSeen.has(hash)) return false;
      changesSeen.add(hash);
      return true;
    });
    await this.triggerSideEffects(uniqueChanges);
    console.log('Going to process', uniqueChanges.length, changes.length);
    await this.processDeletes(uniqueChanges);
    console.log('Processed deletes');
    await this.processUpdates(uniqueChanges);
    console.log('Processed updates');
    if (this.unprocessedChanges.length > 0) {
      this.processChangesIntoDb();
    } else {
      this.isProcessing = false;
    }
  };

  /**
   * Returns the oldest changes on the sync queue, up to numberToGet. Returns a promise, which can be
   * awaited by the calling function.
   **/
  async get(numberToGet) {
    const criteria = {
      is_dead_letter: false,
      is_deleted: false,
    };
    if (!getIsProductionEnvironment()) {
      criteria.priority = {
        comparator: '<',
        comparisonValue: 5,
      };
    }
    const changes = await this.syncQueueModel.find(criteria, {
      sort: ['priority', 'change_time'],
      limit: numberToGet,
    });
    return changes.map(change => ({
      ...change,
      details: JSON.parse(change.details),
    }));
  }

  /**
   * Removes the given change from the sync queue, i.e. marks it as 'used'. Returns a promise, which
   * can be awaited by the calling function.
   **/
  use(change) {
    return this.syncQueueModel.updateById(change.id, { is_deleted: true });
  }

  deprioritise(change) {
    // Update also causes change_time to be reset to current time
    // so it will slot in at the back of its new priority group
    const newPriority = Math.min(LOWEST_PRIORITY, change.priority + 1); // Cap the priority
    return this.syncQueueModel.updateById(change.id, { priority: newPriority });
  }

  registerBadRequest(change) {
    // Update also causes change_time to be reset to current time
    // so it will slot in at the back of its new priority group
    if (change.bad_request_count > BAD_REQUEST_LIMIT) {
      return this.syncQueueModel.updateById(change.id, { is_dead_letter: true });
    } // Cap the priority
    return this.syncQueueModel.updateById(change.id, {
      bad_request_count: change.bad_request_count + 1,
    });
  }
}
