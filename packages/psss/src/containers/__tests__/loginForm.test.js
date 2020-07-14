/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API } from '../../api';
import { LoginForm } from '../Forms';
import { render } from '../../utils/test-utils';

jest.mock('../../api');

describe('login form', () => {
  const testData = {
    email: 'tupaia@gmail.com',
    password: 'password123',
  };

  it('submits a login form with email and password field', async () => {
    API.reauthenticate.mockResolvedValueOnce({ user: { name: 'tupaia' } });
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login*/i });

    await userEvent.type(emailInput, testData.email);
    await userEvent.type(passwordInput, testData.password);

    await act(async () => {
      await userEvent.click(submitButton);
    });

    expect(API.reauthenticate).toHaveBeenCalledWith({
      emailAddress: testData.email,
      password: testData.password,
      deviceName: window.navigator.userAgent,
    });

    expect(API.reauthenticate).toHaveBeenCalledTimes(1);
    API.reauthenticate.mockReset();
  });
});