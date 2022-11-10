import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { openTypeAheadAtCursor } from '../transforms/open-typeahead-at-cursor';
import { INPUT_METHOD } from '../../analytics';
import { createRule, createPlugin } from '../../../utils/input-rules';
export function inputRulePlugin(schema, typeAheads, featureFlags) {
  if (!typeAheads || typeAheads.length === 0) {
    return;
  }

  var rules = typeAheads.reduce(function (acc, typeAhead) {
    var trigger = typeAhead.customRegex || typeAhead.trigger;

    if (!trigger) {
      return acc;
    }

    var regex = new RegExp("(^|[.!?\\s".concat(leafNodeReplacementCharacter, "])(").concat(trigger, ")$"));
    acc.push(createRule(regex, function (state, match) {
      return openTypeAheadAtCursor({
        triggerHandler: typeAhead,
        inputMethod: INPUT_METHOD.KEYBOARD
      })(state.tr);
    }));
    return acc;
  }, []);
  var plugin = createPlugin('type-ahead', rules, {
    allowInsertTextOnDocument: false
  });
  return plugin;
}
export default inputRulePlugin;