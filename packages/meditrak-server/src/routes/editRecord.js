/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 **/

import {
  respond,
  ValidationError,
  ObjectValidator,
  constructRecordExistsWithId,
} from '@tupaia/utils';
import { TYPES } from '@tupaia/database';
import { resourceToRecordType } from '../utilities';
import {
  editAccessRequest,
  editUserAccount,
  editOption,
  editOptionSet,
  editSurveyScreenComponent,
} from '../dataAccessors';

const EDITABLE_RECORD_TYPES = [
  TYPES.USER_ACCOUNT,
  TYPES.SURVEY_RESPONSE,
  TYPES.SURVEY,
  TYPES.SURVEY_SCREEN_COMPONENT,
  TYPES.USER_ENTITY_PERMISSION,
  TYPES.ANSWER,
  TYPES.QUESTION,
  TYPES.FEED_ITEM,
  TYPES.OPTION_SET,
  TYPES.OPTION,
  TYPES.DATA_SOURCE,
  TYPES.ALERT,
  TYPES.COMMENT,
  TYPES.ACCESS_REQUEST,
];

const CUSTOM_RECORD_UPDATERS = {
  [TYPES.USER_ACCOUNT]: editUserAccount,
  [TYPES.OPTION_SET]: editOptionSet,
  [TYPES.OPTION]: editOption,
  [TYPES.SURVEY_SCREEN_COMPONENT]: editSurveyScreenComponent,
  [TYPES.ACCESS_REQUEST]: editAccessRequest,
};

/**
 * Responds to PUT requests by editing a record
 **/
export async function editRecord(req, res) {
  const { database, params, body: updatedFields, models } = req;
  const { resource, id } = params;
  const recordType = resourceToRecordType(resource);

  // Validate that the record matches required format
  if (!EDITABLE_RECORD_TYPES.includes(recordType)) {
    throw new ValidationError(`${resource} is not a valid PUT endpoint`);
  }
  const validator = new ObjectValidator({
    id: [constructRecordExistsWithId(database, recordType)],
  });
  await validator.validate({ id }); // Will throw an error if not valid

  // Update the record, using a custom updater if necessary
  if (CUSTOM_RECORD_UPDATERS[recordType]) {
    await CUSTOM_RECORD_UPDATERS[recordType](models, id, updatedFields, req);
  } else {
    await models.getModelForDatabaseType(recordType).updateById(id, updatedFields);
  }
  respond(res, { message: `Successfully updated ${resource}` });
}
