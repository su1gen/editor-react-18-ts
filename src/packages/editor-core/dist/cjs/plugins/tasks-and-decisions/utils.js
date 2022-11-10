"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformSliceToDecisionList = void 0;

var _prosemirrorModel = require("prosemirror-model");

// If slice is decisionItem, wrap it inside a decisionList. This prevents an
// additional newline from being pasted along with the selected decision item.
var transformSliceToDecisionList = function transformSliceToDecisionList(slice, schema) {
  var node = slice.content.firstChild;

  if (slice.content.childCount === 1 && node && node.type.name === 'decisionItem') {
    var decisionListWrapperNode = schema.nodes.decisionList.create({}, node);
    return new _prosemirrorModel.Slice(_prosemirrorModel.Fragment.from(decisionListWrapperNode), slice.openStart, slice.openEnd);
  }

  return slice;
};

exports.transformSliceToDecisionList = transformSliceToDecisionList;