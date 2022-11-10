"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showPlaceholderFloatingToolbar = exports.insertPlaceholderTextAtSelection = exports.hidePlaceholderFloatingToolbar = void 0;

var _pluginKey = require("./plugin-key");

var showPlaceholderFloatingToolbar = function showPlaceholderFloatingToolbar(state, dispatch) {
  var tr = state.tr;

  if (!state.selection.empty) {
    tr.deleteSelection();
  }

  tr.setMeta(_pluginKey.pluginKey, {
    showInsertPanelAt: tr.selection.anchor
  });
  tr.scrollIntoView();
  dispatch(tr);
  return true;
};

exports.showPlaceholderFloatingToolbar = showPlaceholderFloatingToolbar;

var insertPlaceholderTextAtSelection = function insertPlaceholderTextAtSelection(value) {
  return function (state, dispatch) {
    dispatch(state.tr.replaceSelectionWith(state.schema.nodes.placeholder.createChecked({
      text: value
    })).setMeta(_pluginKey.pluginKey, {
      showInsertPanelAt: null
    }).scrollIntoView());
    return true;
  };
};

exports.insertPlaceholderTextAtSelection = insertPlaceholderTextAtSelection;

var hidePlaceholderFloatingToolbar = function hidePlaceholderFloatingToolbar(state, dispatch) {
  dispatch(state.tr.setMeta(_pluginKey.pluginKey, {
    showInsertPanelAt: null
  }));
  return true;
};

exports.hidePlaceholderFloatingToolbar = hidePlaceholderFloatingToolbar;