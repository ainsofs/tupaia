/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

import React from 'react';

function ReferenceLabel(props) {
  const { fill, fontSize, value, viewBox } = props;
  const x = viewBox.width / 2 + 30;
  const y = viewBox.y + 15;

  return (
    <text x={x} y={y} fill={fill} fontSize={fontSize || 14} fontWeight="bolder">
      {`Average ${parseFloat(value) + 3}`}
    </text>
  );
}

export default ReferenceLabel;
