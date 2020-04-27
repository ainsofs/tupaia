import React from 'react';
import styled from 'styled-components';
import MuiContainer from '@material-ui/core/Container';
import MuiLink from '@material-ui/core/Link';
import * as COLORS from '../theme/colors';

const footerColor = '#c4c4c4';

const Container = styled.footer`
  background: ${COLORS.DARKGREY};
  padding: 1rem;

  span,
  a {
    color: ${footerColor};
    font-size: 12px;
    line-height: 14px;
    margin-right: 1rem;
  }
`;

const date = new Date();

export const Footer = () => (
  <Container>
    <MuiContainer>
      <span>&copy; {date.getFullYear()} Beyond Essential</span>
      <MuiLink href="https://tupaia.org">tupaia.org</MuiLink>
    </MuiContainer>
  </Container>
);
