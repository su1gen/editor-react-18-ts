import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { openTypeAheadAtCursor } from '../transforms/open-typeahead-at-cursor';
import { INPUT_METHOD } from '../../analytics';
import { createRule, createPlugin } from '../../../utils/input-rules';
export function inputRulePlugin(schema, typeAheads, featureFlags) {
  if (!typeAheads || typeAheads.length === 0) {
    return;
  }

  const rules = typeAheads.reduce((acc, typeAhead) => {
    const trigger = typeAhead.customRegex || typeAhead.trigger;

    if (!trigger) {
      return acc;
    }

    const regex = new RegExp(`(^|[.!?\\s${leafNodeReplacementCharacter}])(${trigger})$`);
    acc.push(createRule(regex, (state, match) => {
      return openTypeAheadAtCursor({
        triggerHandler: typeAhead,
        inputMethod: INPUT_METHOD.KEYBOARD
      })(state.tr);
    }));
    return acc;
  }, []);
  const plugin = createPlugin('type-ahead', rules, {
    allowInsertTextOnDocument: false
  });
  return plugin;
}
export default inputRulePlugin;