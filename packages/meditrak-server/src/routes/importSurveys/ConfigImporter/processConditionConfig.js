/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { BooleanExpressionParser } from '@tupaia/expression-parser';
import { splitStringOn, splitStringOnComma, translateExpression } from '../../utilities';

export const processConditionConfig = async (models, config) => {
  const { conditions, defaultValues } = config;
  return {
    conditions: await translateConditions(models, conditions, defaultValues),
  };
};

/**
 * Translate and combine conditions and defaultValues into 1 config object.
 *
 * Excel config:
 * conditions: Yes:RHS6UNFPA1353Calc >= 3,No:RHS6UNFPA1353Calc < 3
 * defaultValues: Yes.RHS6UNFPA1353Calc:0,No.RHS6UNFPA1353Calc:0
 *
 * will be converted to:
 *
 * conditions: {
 *   Yes: {
 *     formula: '5fa0cdcd5da1e614f30001fd >= 3',
 *     defaultValues: {
 *        '5fa0cdcd5da1e614f30001fd': '0',
 *     },
 *   },
 *   No: {
 *     formula: '5fa0cdcd5da1e614f30001fd < 3',
 *     defaultValues: {
 *       '5fa0cdcd5da1e614f30001fd': '0',
 *     },
 *   },
 * }
 * @param {*} models
 * @param {*} conditionsConfig
 * @param {*} defaultValuesConfig
 */
const translateConditions = async (models, conditionsConfig, defaultValuesConfig = '') => {
  const conditions = splitStringOnComma(conditionsConfig);
  const translatedConditions = {};
  const expressionParser = new BooleanExpressionParser();

  // Translate the expressions
  for (const condition of conditions) {
    const [targetValue, expression] = splitStringOn(condition, ':');
    const variables = expressionParser.getVariables(expression);
    const codes = variables.map(v => v.replace(/^\$/, ''));
    const translatedExpression = await translateExpression(models, expression, codes);
    translatedConditions[targetValue] = {
      formula: translatedExpression,
    };
  }

  const defaultValues = splitStringOnComma(defaultValuesConfig);
  const codes = [
    ...new Set( // Remove duplicated codes
      defaultValues.map(defaultValue => {
        const [key] = splitStringOn(defaultValue, ':');
        const [targetValue, code] = splitStringOn(key, '.');
        return code;
      }),
    ),
  ];

  const questionCodeToId = await models.question.findCodeToId(codes);
  // Translate the defaultValues (optional)
  for (const defaultValue of defaultValues) {
    const [key, value] = splitStringOn(defaultValue, ':');
    const [targetValue, code] = splitStringOn(key, '.');
    const questionId = questionCodeToId[code];

    if (!translatedConditions[targetValue]) {
      translatedConditions[targetValue] = {};
    }

    if (!translatedConditions[targetValue].defaultValues) {
      translatedConditions[targetValue].defaultValues = {};
    }

    translatedConditions[targetValue].defaultValues = {
      ...translatedConditions[targetValue].defaultValues,
      [questionId]: value,
    };
  }

  return translatedConditions;
};
