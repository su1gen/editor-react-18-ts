"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeNextListAtPosition = mergeNextListAtPosition;

var _node = require("../utils/node");

function mergeNextListAtPosition(_ref) {
  var tr = _ref.tr,
      listPosition = _ref.listPosition;
  var listNodeAtPosition = tr.doc.nodeAt(listPosition);

  if (!(0, _node.isListNode)(listNodeAtPosition)) {
    return;
  }

  var listPositionResolved = tr.doc.resolve(listPosition + listNodeAtPosition.nodeSize);
  var pos = listPositionResolved.pos,
      nodeAfter = listPositionResolved.nodeAfter,
      nodeBefore = listPositionResolved.nodeBefore;

  if (!(0, _node.isListNode)(nodeBefore) || !(0, _node.isListNode)(nodeAfter)) {
    return;
  }

  if ((nodeAfter === null || nodeAfter === void 0 ? void 0 : nodeAfter.type.name) !== (nodeBefore === null || nodeBefore === void 0 ? void 0 : nodeBefore.type.name)) {
    var previousListPosition = pos - nodeBefore.nodeSize;
    tr.setNodeMarkup(previousListPosition, nodeAfter.type);
  }

  tr.join(pos);
}