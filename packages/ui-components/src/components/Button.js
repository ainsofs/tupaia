/**
 * Tupaia Web
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import styled from 'styled-components';
import MuiButton from '@material-ui/core/Button';
import { WHITE } from '../theme/colors';

export const Button = ({ children, isSubmitting = false, disabled, ...props }) => {
  return (
    <MuiButton variant="contained" {...props} disabled={isSubmitting}>
      {isSubmitting ? 'Loading...' : children}
    </MuiButton>
  );
};

const StyledButton = styled(Button)`
  border: 0;
  color: ${WHITE};
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  &:disabled {
    color: ${WHITE};
  }
`;

export const GradientButton = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};
