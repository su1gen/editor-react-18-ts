"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RelativeSelectionPos", {
  enumerable: true,
  get: function get() {
    return _selection.RelativeSelectionPos;
  }
});
exports.selectionPluginKey = exports.SelectionDirection = void 0;

var _prosemirrorState = require("prosemirror-state");

var _selection = require("@atlaskit/editor-common/selection");

var selectionPluginKey = new _prosemirrorState.PluginKey('selection');
exports.selectionPluginKey = selectionPluginKey;
var SelectionDirection;
exports.SelectionDirection = SelectionDirection;

(function (SelectionDirection) {
  SelectionDirection[SelectionDirection["Before"] = -1] = "Before";
  SelectionDirection[SelectionDirection["After"] = 1] = "After";
})(SelectionDirection || (exports.SelectionDirection = SelectionDirection = {}));