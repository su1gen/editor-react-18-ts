"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeBreakout = removeBreakout;

var _findBreakoutNode = require("../utils/find-breakout-node");

var _prosemirrorState = require("prosemirror-state");

function removeBreakout() {
  return function (state, dispatch) {
    var node = (0, _findBreakoutNode.findSupportedNodeForBreakout)(state.selection);

    if (!node) {
      return false;
    }

    var marks = node.node.marks.filter(function (m) {
      return m.type.name !== 'breakout';
    });
    var tr = state.tr.setNodeMarkup(node.pos, node.node.type, node.node.attrs, marks);
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