"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBreakoutMode = getBreakoutMode;

var _findBreakoutNode = require("./find-breakout-node");

/**
 * Get the current mode of the breakout at the selection
 * @param state Current EditorState
 */
function getBreakoutMode(state) {
  var node = (0, _findBreakoutNode.findSupportedNodeForBreakout)(state.selection);

  if (!node) {
    return;
  }

  var breakoutMark = node.node.marks.find(function (m) {
    return m.type.name === 'breakout';
  });

  if (!breakoutMark) {
    return;
  }

  return breakoutMark.attrs.mode;
}