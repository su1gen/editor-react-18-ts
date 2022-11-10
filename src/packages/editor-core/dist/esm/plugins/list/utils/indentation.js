import { numberNestedLists } from './selection';
import { isListItemNode, isListNode } from './node'; // This will return (depth - 1) for root list parent of a list.

export var getListLiftTarget = function getListLiftTarget(resPos) {
  var target = resPos.depth;

  for (var i = resPos.depth; i > 0; i--) {
    var node = resPos.node(i);

    if (isListNode(node)) {
      target = i;
    }

    if (!isListItemNode(node) && !isListNode(node)) {
      break;
    }
  }

  return target - 1;
};
export var getNextSiblingListItemPosition = function getNextSiblingListItemPosition($pos) {
  var _$pos$doc$nodeAt;

  var target = $pos.depth;
  var found = false;

  for (var i = $pos.depth; i > 0; i--) {
    var node = $pos.node(i);

    if (isListItemNode(node)) {
      target = i;
      found = true;
    }

    if (found) {
      break;
    }
  }

  var listItemPosition = target - 1;
  var listItemNodePosition = ((_$pos$doc$nodeAt = $pos.doc.nodeAt(listItemPosition)) === null || _$pos$doc$nodeAt === void 0 ? void 0 : _$pos$doc$nodeAt.nodeSize) || 0;
  var nextListItemPosition = listItemPosition + listItemNodePosition;
  var nextListItemNode = $pos.doc.nodeAt(nextListItemPosition);

  if (nextListItemNode) {
    return $pos.doc.resolve(nextListItemPosition);
  }

  return null;
};
export var hasValidListIndentationLevel = function hasValidListIndentationLevel(_ref) {
  var tr = _ref.tr,
      maxIndentation = _ref.maxIndentation;
  var initialIndentationLevel = numberNestedLists(tr.selection.$from);
  var currentIndentationLevel;
  var currentPos = tr.selection.$to.pos;

  do {
    var resolvedPos = tr.doc.resolve(currentPos);
    currentIndentationLevel = numberNestedLists(resolvedPos);

    if (currentIndentationLevel > maxIndentation) {
      return false;
    }

    currentPos++;
  } while (currentIndentationLevel >= initialIndentationLevel);

  return true;
};