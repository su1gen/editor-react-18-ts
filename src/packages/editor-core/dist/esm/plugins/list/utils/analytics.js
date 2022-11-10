import { isListNode, isListItemNode } from './node';
import { getListItemAttributes } from './selection';
export var getCommonListAnalyticsAttributes = function getCommonListAnalyticsAttributes(state) {
  var _state$selection = state.selection,
      $from = _state$selection.$from,
      $to = _state$selection.$to;
  var fromAttrs = getListItemAttributes($from);
  var toAttrs = getListItemAttributes($to);
  return {
    itemIndexAtSelectionStart: fromAttrs.itemIndex,
    itemIndexAtSelectionEnd: toAttrs.itemIndex,
    indentLevelAtSelectionStart: fromAttrs.indentLevel,
    indentLevelAtSelectionEnd: toAttrs.indentLevel,
    itemsInSelection: countListItemsInSelection(state)
  };
};
export var countListItemsInSelection = function countListItemsInSelection(state) {
  var _state$selection2 = state.selection,
      from = _state$selection2.from,
      to = _state$selection2.to;

  if (from === to) {
    return 1;
  }

  var count = 0;
  var listSlice = state.doc.cut(from, to);
  listSlice.content.nodesBetween(0, listSlice.content.size, function (node, pos, parent, index) {
    if (parent && isListItemNode(parent) && !isListNode(node) && index === 0) {
      count++;
    }
  });
  return count;
};