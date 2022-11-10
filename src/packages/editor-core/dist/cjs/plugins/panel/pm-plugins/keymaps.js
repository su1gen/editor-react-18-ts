"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.keymapPlugin = keymapPlugin;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("../../../utils");

function findParentNode(selection, nodeType) {
  var parentPosition = (0, _prosemirrorUtils.findParentNodeOfType)(nodeType)(selection);

  if (parentPosition) {
    return parentPosition.node;
  }

  return null;
}

function isInsideAnEmptyNode(selection, nodeType, schema) {
  var parentNode = findParentNode(selection, nodeType);
  return parentNode && (0, _utils.isEmptyNode)(schema)(parentNode);
} // Somewhat broken and subverted: https://product-fabric.atlassian.net/browse/ED-6504


function keymapPlugin() {
  var deleteCurrentItem = function deleteCurrentItem($from, tr) {
    return tr.delete($from.before($from.depth) - 1, $from.end($from.depth) + 1);
  };

  var keymaps = {
    Backspace: function Backspace(state, dispatch) {
      var selection = state.selection,
          nodes = state.schema.nodes,
          tr = state.tr;
      var panel = nodes.panel,
          blockquote = nodes.blockquote;
      var $from = selection.$from,
          $to = selection.$to; // Don't do anything if selection is a range

      if ($from.pos !== $to.pos) {
        return false;
      } // If not at the start of a panel, no joining will happen so allow default behaviour (backspacing characters etc..)


      if ($from.parentOffset !== 0) {
        return false;
      }

      var previousPos = tr.doc.resolve(Math.max(0, $from.before($from.depth) - 1));
      var previousNodeType = previousPos.pos > 0 && previousPos.parent && previousPos.parent.type;
      var parentNodeType = $from.parent.type;
      var isPreviousNodeAPanel = previousNodeType === panel;
      var isParentNodeAPanel = parentNodeType === panel; // Stops merging panels when deleting empty paragraph in between

      if (isPreviousNodeAPanel && !isParentNodeAPanel || isInsideAnEmptyNode(selection, panel, state.schema) || isInsideAnEmptyNode(selection, blockquote, state.schema)) {
        var content = $from.node($from.depth).content;
        var insertPos = previousPos.pos;
        deleteCurrentItem($from, tr).insert(insertPos, content);

        if (dispatch) {
          dispatch((0, _prosemirrorUtils.setTextSelection)(insertPos)(tr).scrollIntoView());
        }

        return true;
      }

      var nodeType = $from.node().type;

      if (nodeType !== panel) {
        return false;
      }

      return true;
    }
  };
  return (0, _prosemirrorKeymap.keymap)(keymaps);
}

var _default = keymapPlugin;
exports.default = _default;