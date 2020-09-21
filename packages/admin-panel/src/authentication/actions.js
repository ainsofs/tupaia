/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 */

import {
  EMAIL_ADDRESS_CHANGE,
  PASSWORD_CHANGE,
  REMEMBER_ME_CHANGE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  PROFILE_SUCCESS,
  PROFILE_REQUEST,
  PROFILE_ERROR,
  PASSWORD_SUCCESS,
  PASSWORD_REQUEST,
  PASSWORD_ERROR,
} from './constants';

export const changeEmailAddress = emailAddress => ({
  type: EMAIL_ADDRESS_CHANGE,
  emailAddress,
});

export const changePassword = password => ({
  type: PASSWORD_CHANGE,
  password,
});

export const changeRememberMe = rememberMe => ({
  type: REMEMBER_ME_CHANGE,
  rememberMe,
});

export const login = (emailAddress, password) => async (dispatch, getState, { api }) => {
  const deviceName = window.navigator.userAgent;
  dispatch({
    // Set state to logging in
    type: LOGIN_REQUEST,
  });
  try {
    const userDetails = await api.reauthenticate({
      emailAddress,
      password,
      deviceName,
    });
    dispatch(loginSuccess(userDetails));
  } catch (error) {
    dispatch(loginError(error.message));
  }
};

export const loginSuccess = ({ accessToken, refreshToken, user }) => dispatch => {
  dispatch({
    type: LOGIN_SUCCESS,
    accessToken,
    refreshToken,
    user,
  });
};

export const loginError = errorMessage => ({
  type: LOGIN_ERROR,
  errorMessage,
});

export const logout = () => ({
  type: LOGOUT,
});

// Profile
export const updateProfile = (id, payload) => async (dispatch, getState, { api }) => {
  dispatch({
    type: PROFILE_REQUEST,
  });
  try {
    await api.put(`user/${id}`, null, payload);
    const { body: user } = await api.get(`user/${id}`);

    dispatch({
      type: PROFILE_SUCCESS,
      ...user,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      profileErrorMessage: error.message,
    });
  }
};

// Password
export const updatePassword = payload => async (dispatch, getState, { api }) => {
  dispatch({
    type: PASSWORD_REQUEST,
  });
  try {
    console.log('update', payload);
    await api.post(`me/changePassword`, null, payload);

    dispatch({
      type: PASSWORD_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_ERROR,
      passwordErrorMessage: error.message,
    });
  }
};
