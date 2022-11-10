import { Fragment, Slice } from 'prosemirror-model';
import { createRule, createPlugin } from '../../../utils/input-rules';
import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { safeInsert } from '../../../utils/insert';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../../analytics';
import { getFeatureFlags } from '../../feature-flags-context';
export var createHorizontalRule = function createHorizontalRule(state, start, end, inputMethod) {
  if (!state.selection.empty) {
    return null;
  }

  var tr = null;
  var rule = state.schema.nodes.rule;

  var _getFeatureFlags = getFeatureFlags(state),
      newInsertionBehaviour = _getFeatureFlags.newInsertionBehaviour;

  if (newInsertionBehaviour) {
    /**
     * This is a workaround to get rid of the typeahead text when using quick insert
     * Once we insert *nothing*, we get a new transaction, so we can use the new selection
     * without considering the extra text after the `/` command.
     **/
    tr = state.tr.replaceWith(start, end, Fragment.empty);
    tr = safeInsert(rule.createChecked(), tr.selection.from)(tr);
  }

  if (!tr) {
    tr = state.tr.replaceRange(start, end, new Slice(Fragment.from(state.schema.nodes.rule.createChecked()), 0, 0));
  }

  return addAnalytics(state, tr, {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
    attributes: {
      inputMethod: inputMethod
    },
    eventType: EVENT_TYPE.TRACK
  });
};

var createHorizontalRuleAutoformat = function createHorizontalRuleAutoformat(state, start, end) {
  return createHorizontalRule(state, start, end, INPUT_METHOD.FORMATTING);
};

export function inputRulePlugin(schema, featureFlags) {
  var rules = [];

  if (schema.nodes.rule) {
    // '---' and '***' for hr
    rules.push(createRule(/^(\-\-\-|\*\*\*)$/, function (state, _match, start, end) {
      return createHorizontalRuleAutoformat(state, start, end);
    })); // '---' and '***' after shift+enter for hr

    rules.push(createRule(new RegExp("".concat(leafNodeReplacementCharacter, "(\\-\\-\\-|\\*\\*\\*)")), function (state, _match, start, end) {
      var hardBreak = state.schema.nodes.hardBreak;

      if (state.doc.resolve(start).nodeAfter.type !== hardBreak) {
        return null;
      }

      return createHorizontalRuleAutoformat(state, start, end);
    }));
  }

  if (rules.length !== 0) {
    return createPlugin('rule', rules, {
      isBlockNodeRule: true
    });
  }

  return;
}
export default inputRulePlugin;