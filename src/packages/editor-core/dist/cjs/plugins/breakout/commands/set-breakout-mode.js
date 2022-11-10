"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBreakoutMode = setBreakoutMode;

var _findBreakoutNode = require("../utils/find-breakout-node");

var _prosemirrorState = require("prosemirror-state");

function setBreakoutMode(mode) {
  return function (state, dispatch) {
    var node = (0, _findBreakoutNode.findSupportedNodeForBreakout)(state.selection);

    if (!node) {
      return false;
    }

    var tr = state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, [state.schema.marks.breakout.create({
      mode: mode
    })]);
    tr.setMeta('scrollIntoView', false);

    if (state.selection instanceof _prosemirrorState.NodeSelection) {
      if (state.selection.$anchor.pos === node.pos) {
        tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, node.pos));
      }
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}