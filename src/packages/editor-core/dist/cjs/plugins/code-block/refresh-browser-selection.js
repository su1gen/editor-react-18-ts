"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@atlaskit/editor-common/utils");

var _pluginKey = require("./plugin-key");

// Workaround for a firefox issue where dom selection is off sync
// https://product-fabric.atlassian.net/browse/ED-12442
var refreshBrowserSelection = function refreshBrowserSelection() {
  var domSelection = window.getSelection();

  if (domSelection) {
    var domRange = domSelection && domSelection.rangeCount === 1 && domSelection.getRangeAt(0).cloneRange();

    if (domRange) {
      domSelection.removeAllRanges();
      domSelection.addRange(domRange);
    }
  }
};

var refreshBrowserSelectionOnChange = function refreshBrowserSelectionOnChange(transaction, editorState) {
  var _pluginKey$getState;

  if (_utils.browser.gecko && transaction.docChanged && // codeblockState.pos should be set if current selection is in a codeblock.
  typeof ((_pluginKey$getState = _pluginKey.pluginKey.getState(editorState)) === null || _pluginKey$getState === void 0 ? void 0 : _pluginKey$getState.pos) === 'number') {
    refreshBrowserSelection();
  }
};

var _default = refreshBrowserSelectionOnChange;
exports.default = _default;