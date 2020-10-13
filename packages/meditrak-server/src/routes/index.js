/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 */

import { authenticate } from './authenticate';
import { countChanges } from './countChanges';
import { deleteRecord } from './deleteRecord';
import { editRecord } from './editRecord';
import { exportSurveyResponses } from './exportSurveyResponses';
import { exportSurveys } from './exportSurveys';
import { getChanges } from './getChanges';
import { GETAnswers } from './GETAnswers';
import { GETDisasters } from './GETDisasters';
import { GETDashboardReports } from './GETDashboardReports';
import { GETDashboardGroups } from './GETDashboardGroups';
import { GETIndicators } from './GETIndicators';
import { GETMapOverlays } from './GETMapOverlays';
import { GETSurveyGroups } from './GETSurveyGroups';
import { GETSurveyResponses } from './GETSurveyResponses';
import { GETQuestions } from './GETQuestions';
import { GETPermissionGroups } from './GETPermissionGroups';
import { GETOptions } from './GETOptions';
import { GETOptionSets } from './GETOptionSets';
import { CreateUserAccounts, RegisterUserAccounts, EditUserAccounts, GETUserAccounts } from './userAccounts';
import {
  DeleteUserEntityPermissions,
  EditUserEntityPermissions,
  GETUserEntityPermissions,
} from './userEntityPermissions';
import { EditAccessRequests, GETAccessRequests } from './accessRequests';
import { importEntities } from './importEntities';
import { importStriveLabResults } from './importStriveLabResults';
import { importSurveys } from './importSurveys';
import { importUsers } from './importUsers';
import { importOptionSets } from './importOptionSets';
import { postChanges } from './postChanges';
import { pruneChanges } from './pruneChanges';
import { addRecord } from './addRecord';
import { importSurveyResponses } from './importSurveyResponses';
import { changePassword } from './changePassword';
import { editUser } from './editUser';
import { requestCountryAccess } from './requestCountryAccess';
import { getSocialFeed } from './getSocialFeed';
import { getUserRewards } from './getUserRewards';
import { getUser } from './getUser';
import { requestPasswordReset } from './requestPasswordReset';
import { getCountryAccessList } from './getCountryAccessList';
import { surveyResponse } from './surveyResponse';
import { importDisaster } from './importDisaster';
import { verifyEmail, requestResendEmail } from './verifyEmail';

/**
 * All routes will be wrapped with an error catcher that simply passes the error to the next()
 * function, causing error handling middleware to be fired. Otherwise, async errors will be
 * swallowed.
 */
const catchAsyncErrors = routeHandler => (res, req, next) => {
  const returnValue = routeHandler(res, req, next);
  if (returnValue && returnValue.catch) {
    // Return value is a Promise, add an error handler
    returnValue.catch(error => next(error));
  }
};

const useRouteHandler = HandlerClass =>
  catchAsyncErrors(async (res, req) => {
    const handler = new HandlerClass(res, req);
    await handler.handle();
  });

export default {
  authenticate: catchAsyncErrors(authenticate),
  countChanges: catchAsyncErrors(countChanges),
  deleteRecord: catchAsyncErrors(deleteRecord),
  deleteUserEntityPermissions: useRouteHandler(DeleteUserEntityPermissions),
  editRecord: catchAsyncErrors(editRecord),
  createUserAccount: useRouteHandler(CreateUserAccounts),
  registerUserAccount: useRouteHandler(RegisterUserAccounts),
  editAccessRequests: useRouteHandler(EditAccessRequests),
  editUserAccounts: useRouteHandler(EditUserAccounts),
  editUserEntityPermissions: useRouteHandler(EditUserEntityPermissions),
  exportSurveyResponses: catchAsyncErrors(exportSurveyResponses),
  exportSurveys: catchAsyncErrors(exportSurveys),
  getChanges: catchAsyncErrors(getChanges),
  getAnswers: useRouteHandler(GETAnswers),
  getDisasters: useRouteHandler(GETDisasters),
  getDashboardReports: useRouteHandler(GETDashboardReports),
  getDashboardGroups: useRouteHandler(GETDashboardGroups),
  getIndicators: useRouteHandler(GETIndicators),
  getMapOverlays: useRouteHandler(GETMapOverlays),
  getSurveyGroups: useRouteHandler(GETSurveyGroups),
  getSurveyResponses: useRouteHandler(GETSurveyResponses),
  getQuestions: useRouteHandler(GETQuestions),
  getPermissionGroups: useRouteHandler(GETPermissionGroups),
  getOptions: useRouteHandler(GETOptions),
  getOptionSets: useRouteHandler(GETOptionSets),
  getUserAccounts: useRouteHandler(GETUserAccounts),
  getUserEntityPermissions: useRouteHandler(GETUserEntityPermissions),
  getAccessRequests: useRouteHandler(GETAccessRequests),
  importEntities: catchAsyncErrors(importEntities),
  importStriveLabResults: catchAsyncErrors(importStriveLabResults),
  importSurveys: catchAsyncErrors(importSurveys),
  importUsers: catchAsyncErrors(importUsers),
  importOptionSets: catchAsyncErrors(importOptionSets),
  postChanges: catchAsyncErrors(postChanges),
  pruneChanges: catchAsyncErrors(pruneChanges),
  addRecord: catchAsyncErrors(addRecord),
  importSurveyResponses: catchAsyncErrors(importSurveyResponses),
  changePassword: catchAsyncErrors(changePassword),
  editUser: catchAsyncErrors(editUser),
  requestCountryAccess: catchAsyncErrors(requestCountryAccess),
  getSocialFeed: catchAsyncErrors(getSocialFeed),
  getUserRewards: catchAsyncErrors(getUserRewards),
  getUser: catchAsyncErrors(getUser),
  requestPasswordReset: catchAsyncErrors(requestPasswordReset),
  getCountryAccessList: catchAsyncErrors(getCountryAccessList),
  surveyResponse: catchAsyncErrors(surveyResponse),
  importDisaster: catchAsyncErrors(importDisaster),
  verifyEmail: catchAsyncErrors(verifyEmail),
  requestResendEmail: catchAsyncErrors(requestResendEmail),
};
