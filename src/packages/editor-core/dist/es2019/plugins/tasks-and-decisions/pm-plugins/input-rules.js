import { NodeSelection, TextSelection } from 'prosemirror-state';
import { canInsert } from 'prosemirror-utils';
import { createRule, createPlugin } from '../../../utils/input-rules';
import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { INPUT_METHOD } from '../../analytics';
import { changeInDepth, insertTaskDecisionAction, getListTypes } from '../commands';

const createListRule = (regex, listType) => {
  return createRule(regex, (state, _match, start, end) => {
    const {
      paragraph
    } = state.schema.nodes;
    const {
      list
    } = getListTypes(listType, state.schema);
    const $end = state.doc.resolve(end);
    const $endOfParent = state.doc.resolve($end.after()); // Only allow creating list in nodes that support them.
    // Parent must be a paragraph as we don't want this applying to headings

    if ($end.parent.type !== paragraph || !canInsert($endOfParent, list.createAndFill())) {
      return null;
    }

    const insertTr = insertTaskDecisionAction(state, listType, INPUT_METHOD.FORMATTING, addItem(start, end));
    return insertTr;
  });
};

const addItem = (start, end) => ({
  tr,
  state,
  list,
  item,
  listLocalId,
  itemLocalId
}) => {
  const {
    selection: {
      $from
    },
    schema
  } = state;
  const {
    hardBreak
  } = schema.nodes;
  const content = $from.node($from.depth).content;
  let shouldBreakNode = false;
  content.forEach((node, offset) => {
    if (node.type === hardBreak && offset < start) {
      shouldBreakNode = true;
    }
  });

  if (!shouldBreakNode) {
    tr.replaceRangeWith($from.before(), $from.after(), list.create({
      localId: listLocalId
    }, [item.create({
      localId: itemLocalId
    }, content)])).delete(start + 1, end + 1).setSelection(new TextSelection(tr.doc.resolve(start + 1)));
  } else {
    const depthAdjustment = changeInDepth($from, tr.selection.$from);
    tr.split($from.pos).setSelection(new NodeSelection(tr.doc.resolve($from.pos + 1))).replaceSelectionWith(list.create({
      localId: listLocalId
    }, [item.create({
      localId: itemLocalId
    }, // TODO: [ts30] handle void and null properly
    tr.doc.nodeAt($from.pos + 1).content)])).setSelection(new TextSelection(tr.doc.resolve($from.pos + depthAdjustment))).delete(start, end + 1);
  }

  return tr;
};

export function inputRulePlugin(schema, featureFlags) {
  const rules = [];
  const {
    decisionList,
    decisionItem,
    taskList,
    taskItem
  } = schema.nodes;

  if (decisionList && decisionItem) {
    rules.push(createListRule(new RegExp(`(^|${leafNodeReplacementCharacter})\\<\\>\\s$`), 'decisionList'));
  }

  if (taskList && taskItem) {
    rules.push(createListRule(new RegExp(`(^|${leafNodeReplacementCharacter})\\[\\]\\s$`), 'taskList'));
  }

  return createPlugin('tasks-and-decisions', rules, {
    isBlockNodeRule: true
  });
}
export default inputRulePlugin;