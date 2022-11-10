import { NodeSelection, TextSelection } from 'prosemirror-state';
import { canInsert } from 'prosemirror-utils';
import { createRule, createPlugin } from '../../../utils/input-rules';
import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { INPUT_METHOD } from '../../analytics';
import { changeInDepth, insertTaskDecisionAction, getListTypes } from '../commands';

var createListRule = function createListRule(regex, listType) {
  return createRule(regex, function (state, _match, start, end) {
    var paragraph = state.schema.nodes.paragraph;

    var _getListTypes = getListTypes(listType, state.schema),
        list = _getListTypes.list;

    var $end = state.doc.resolve(end);
    var $endOfParent = state.doc.resolve($end.after()); // Only allow creating list in nodes that support them.
    // Parent must be a paragraph as we don't want this applying to headings

    if ($end.parent.type !== paragraph || !canInsert($endOfParent, list.createAndFill())) {
      return null;
    }

    var insertTr = insertTaskDecisionAction(state, listType, INPUT_METHOD.FORMATTING, addItem(start, end));
    return insertTr;
  });
};

var addItem = function addItem(start, end) {
  return function (_ref) {
    var tr = _ref.tr,
        state = _ref.state,
        list = _ref.list,
        item = _ref.item,
        listLocalId = _ref.listLocalId,
        itemLocalId = _ref.itemLocalId;
    var $from = state.selection.$from,
        schema = state.schema;
    var hardBreak = schema.nodes.hardBreak;
    var content = $from.node($from.depth).content;
    var shouldBreakNode = false;
    content.forEach(function (node, offset) {
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
      var depthAdjustment = changeInDepth($from, tr.selection.$from);
      tr.split($from.pos).setSelection(new NodeSelection(tr.doc.resolve($from.pos + 1))).replaceSelectionWith(list.create({
        localId: listLocalId
      }, [item.create({
        localId: itemLocalId
      }, // TODO: [ts30] handle void and null properly
      tr.doc.nodeAt($from.pos + 1).content)])).setSelection(new TextSelection(tr.doc.resolve($from.pos + depthAdjustment))).delete(start, end + 1);
    }

    return tr;
  };
};

export function inputRulePlugin(schema, featureFlags) {
  var rules = [];
  var _schema$nodes = schema.nodes,
      decisionList = _schema$nodes.decisionList,
      decisionItem = _schema$nodes.decisionItem,
      taskList = _schema$nodes.taskList,
      taskItem = _schema$nodes.taskItem;

  if (decisionList && decisionItem) {
    rules.push(createListRule(new RegExp("(^|".concat(leafNodeReplacementCharacter, ")\\<\\>\\s$")), 'decisionList'));
  }

  if (taskList && taskItem) {
    rules.push(createListRule(new RegExp("(^|".concat(leafNodeReplacementCharacter, ")\\[\\]\\s$")), 'taskList'));
  }

  return createPlugin('tasks-and-decisions', rules, {
    isBlockNodeRule: true
  });
}
export default inputRulePlugin;