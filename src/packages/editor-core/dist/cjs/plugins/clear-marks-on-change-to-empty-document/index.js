"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.pluginKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _utils = require("../../utils");

var pluginKey = new _prosemirrorState.PluginKey('clearMarksOnChangeToEmptyDocumentPlugin');
exports.pluginKey = pluginKey;

function createPlugin() {
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    appendTransaction: function appendTransaction(_transactions, oldState, newState) {
      // ED-2973: When a user clears the editor's content, remove the current active marks
      if (!(0, _utils.isEmptyDocument)(oldState.doc) && (0, _utils.isEmptyDocument)(newState.doc)) {
        return newState.tr.setStoredMarks([]);
      }

      return;
    }
  });
}

var clearMarksOnChangeToEmptyDocumentPlugin = function clearMarksOnChangeToEmptyDocumentPlugin() {
  return {
    name: 'clearMarksOnEmptyDoc',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'clearMarksOnChange',
        plugin: createPlugin
      }];
    }
  };
};

var _default = clearMarksOnChangeToEmptyDocumentPlugin;
exports.default = _default;