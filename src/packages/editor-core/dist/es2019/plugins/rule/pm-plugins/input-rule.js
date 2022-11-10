import { Fragment, Slice } from 'prosemirror-model';
import { createRule, createPlugin } from '../../../utils/input-rules';
import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { safeInsert } from '../../../utils/insert';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../../analytics';
import { getFeatureFlags } from '../../feature-flags-context';
export const createHorizontalRule = (state, start, end, inputMethod) => {
  if (!state.selection.empty) {
    return null;
  }

  let tr = null;
  const {
    rule
  } = state.schema.nodes;
  const {
    newInsertionBehaviour
  } = getFeatureFlags(state);

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
      inputMethod
    },
    eventType: EVENT_TYPE.TRACK
  });
};

const createHorizontalRuleAutoformat = (state, start, end) => {
  return createHorizontalRule(state, start, end, INPUT_METHOD.FORMATTING);
};

export function inputRulePlugin(schema, featureFlags) {
  const rules = [];

  if (schema.nodes.rule) {
    // '---' and '***' for hr
    rules.push(createRule(/^(\-\-\-|\*\*\*)$/, (state, _match, start, end) => createHorizontalRuleAutoformat(state, start, end))); // '---' and '***' after shift+enter for hr

    rules.push(createRule(new RegExp(`${leafNodeReplacementCharacter}(\\-\\-\\-|\\*\\*\\*)`), (state, _match, start, end) => {
      const {
        hardBreak
      } = state.schema.nodes;

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