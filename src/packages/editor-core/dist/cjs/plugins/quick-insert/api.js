"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQuickInsertTools = void 0;

var _pluginKey = require("./plugin-key");

var _search = require("./search");

var getItems = function getItems(editorView) {
  return function (query, options) {
    var pluginState = _pluginKey.pluginKey.getState(editorView.state);

    if (!pluginState) {
      return [];
    }

    return (0, _search.searchQuickInsertItems)(pluginState, options)(query);
  };
};

var createQuickInsertTools = function createQuickInsertTools(editorView) {
  return {
    getItems: getItems(editorView)
  };
};

exports.createQuickInsertTools = createQuickInsertTools;