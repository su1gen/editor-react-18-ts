import { isListNode } from '../utils/node';
export function mergeNextListAtPosition(_ref) {
  var tr = _ref.tr,
      listPosition = _ref.listPosition;
  var listNodeAtPosition = tr.doc.nodeAt(listPosition);

  if (!isListNode(listNodeAtPosition)) {
    return;
  }

  var listPositionResolved = tr.doc.resolve(listPosition + listNodeAtPosition.nodeSize);
  var pos = listPositionResolved.pos,
      nodeAfter = listPositionResolved.nodeAfter,
      nodeBefore = listPositionResolved.nodeBefore;

  if (!isListNode(nodeBefore) || !isListNode(nodeAfter)) {
    return;
  }

  if ((nodeAfter === null || nodeAfter === void 0 ? void 0 : nodeAfter.type.name) !== (nodeBefore === null || nodeBefore === void 0 ? void 0 : nodeBefore.type.name)) {
    var previousListPosition = pos - nodeBefore.nodeSize;
    tr.setNodeMarkup(previousListPosition, nodeAfter.type);
  }

  tr.join(pos);
}