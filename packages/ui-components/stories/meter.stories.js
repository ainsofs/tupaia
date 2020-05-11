/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import styled from 'styled-components';
import MuiBox from '@material-ui/core/Box';
import { Card, CardContent, CardFooter, BarMeter, CircleMeter } from '../src';
import * as COLORS from './story-utils/theme/colors';

export default {
  title: 'Meters',
};

const Container = styled(MuiBox)`
  max-width: 1200px;
  padding: 3rem;
  background: ${COLORS.LIGHTGREY};

  .MuiCard-root {
    max-width: 360px;
  }
`;

export const barMeter = () => (
  <Container>
    <Card variant="outlined">
      <CardContent>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias aliquid, beatae
        consectetur consequuntur dolorum error explicabo ipsam iusto laborum modi obcaecati quae
        quia quo rem sed tempore unde vel.
      </CardContent>
      <CardFooter>
        <BarMeter value={22} total={30} />
      </CardFooter>
    </Card>
  </Container>
);

export const circleMeter = () => (
  <Container>
    <Card variant="outlined">
      <CardContent>
        <CircleMeter percent={0} />
        <CircleMeter percent={34} />
        <CircleMeter percent={50} />
        <CircleMeter percent={99} />
        <CircleMeter percent={100} />
      </CardContent>
    </Card>
  </Container>
);
