import { createPlugin } from '../../../../utils/input-rules';
import { createRuleForListType } from './create-list-input-rule';
export default function inputRulePlugin(schema, featureFlags) {
  const {
    nodes: {
      bulletList,
      orderedList
    }
  } = schema;
  const rules = [];

  if (bulletList) {
    rules.push(createRuleForListType({
      // Using UTF instead of • character
      // because of issue where product converted the
      // character into an escaped version.
      expression: /^\s*([\*\-\u2022]) $/,
      listType: bulletList
    }));
  }

  if (orderedList) {
    rules.push(createRuleForListType({
      expression: /^(1)[\.\)] $/,
      listType: orderedList
    }));
  }

  if (rules.length !== 0) {
    return createPlugin('lists', rules);
  }

  return;
}