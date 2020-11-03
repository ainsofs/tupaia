/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import math from 'mathjs';

export class ExpressionParser {
  constructor() {
    this.parser = math.parser();
  }

  evaluateExpression(expression) {
    return this.parser.evaluate(expression);
  }

  getVariables() {
    return this.parser.getAll();
  }

  setScopeVariables(values, defaultValues) {
    this.clear();

    Object.entries(values).forEach(([variableName, value]) => {
      const expressionValue = value || defaultValues[variableName];
      this.setScopeVariable(variableName, expressionValue);
    });
  }

  setScopeVariable(name, value) {
    this.parser.set(name, value);
  }

  clear() {
    this.parser.clear();
  }
}
