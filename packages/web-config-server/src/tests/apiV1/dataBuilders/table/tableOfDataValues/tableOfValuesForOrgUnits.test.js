/**
 * Tupaia Config Server
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 */

import sinon from 'sinon';
import { createAssertTableResults } from './helpers';
import { DATA_VALUES, ORG_UNITS } from './tableOfDataValues.fixtures';
import { tableOfValuesForOrgUnits } from '/apiV1/dataBuilders/generic/table';

const models = {
  entity: {
    find: sinon
      .stub()
      .callsFake(({ code: codes }) => ORG_UNITS.filter(({ code }) => codes.includes(code))),
  },
};
const assertTableResults = createAssertTableResults(models, tableOfValuesForOrgUnits, DATA_VALUES);

describe('tableOfValuesForOrgUnits', () => {
  describe('basic', () => {
    it('2 row x 2 col', () =>
      assertTableResults(
        {
          rows: ['Water for hand washing', 'Soap for hand washing'],
          columns: '$orgUnit',
          cells: [['CD1'], ['CD2']],
        },
        {
          rows: [
            { dataElement: 'Water for hand washing', Col1: 1, Col2: 10 },
            { dataElement: 'Soap for hand washing', Col1: 2, Col2: 20 },
          ],
          columns: [
            { key: 'Col1', title: 'Nukunuku' },
            { key: 'Col2', title: 'Vaini' },
          ],
        },
      ));

    it('2 row x 2 col with flat cells', () =>
      assertTableResults(
        {
          rows: ['Water for hand washing', 'Soap for hand washing'],
          columns: '$orgUnit',
          cells: ['CD1', 'CD2'],
        },
        {
          rows: [
            { dataElement: 'Water for hand washing', Col1: 1, Col2: 10 },
            { dataElement: 'Soap for hand washing', Col1: 2, Col2: 20 },
          ],
          columns: [
            { key: 'Col1', title: 'Nukunuku' },
            { key: 'Col2', title: 'Vaini' },
          ],
        },
      ));
  });
});
