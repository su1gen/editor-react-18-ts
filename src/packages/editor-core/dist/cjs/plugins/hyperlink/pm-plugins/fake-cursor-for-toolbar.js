"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorView = require("prosemirror-view");

var _fakeCurorForToolbarPluginKey = require("./fake-curor-for-toolbar-plugin-key");

var _main = require("./main");

var createTextCursor = function createTextCursor(pos) {
  var node = document.createElement('div');
  node.className = 'ProseMirror-fake-text-cursor';
  return _prosemirrorView.Decoration.widget(pos, node, {
    key: 'hyperlink-text-cursor'
  });
};

var createTextSelection = function createTextSelection(from, to) {
  return _prosemirrorView.Decoration.inline(from, to, {
    class: 'ProseMirror-fake-text-selection'
  });
};

var getInsertLinkToolbarState = function getInsertLinkToolbarState(editorState) {
  var state = _main.stateKey.getState(editorState);

  if (state && state.activeLinkMark) {
    if (state.activeLinkMark.type === _main.InsertStatus.INSERT_LINK_TOOLBAR) {
      return state.activeLinkMark;
    }
  }

  return undefined;
};

var fakeCursorToolbarPlugin = new _safePlugin.SafePlugin({
  key: _fakeCurorForToolbarPluginKey.fakeCursorForToolbarPluginKey,
  state: {
    init: function init() {
      return _prosemirrorView.DecorationSet.empty;
    },
    apply: function apply(tr, pluginState, oldState, newState) {
      var oldInsertToolbarState = getInsertLinkToolbarState(oldState);
      var insertToolbarState = getInsertLinkToolbarState(newState); // Map DecorationSet if it still refers to the same position in the document

      if (oldInsertToolbarState && insertToolbarState) {
        var from = insertToolbarState.from,
            to = insertToolbarState.to;
        var oldFrom = tr.mapping.map(oldInsertToolbarState.from);
        var oldTo = tr.mapping.map(oldInsertToolbarState.to);

        if (oldFrom === from && oldTo === to) {
          return pluginState.map(tr.mapping, tr.doc);
        }
      } // Update DecorationSet if new insert toolbar, or if we have moved to a different position in the doc


      if (insertToolbarState) {
        var _from = insertToolbarState.from,
            _to = insertToolbarState.to;
        return _prosemirrorView.DecorationSet.create(tr.doc, [_from === _to ? createTextCursor(_from) : createTextSelection(_from, _to)]);
      }

      return _prosemirrorView.DecorationSet.empty;
    }
  },
  props: {
    decorations: function decorations(state) {
      return _fakeCurorForToolbarPluginKey.fakeCursorForToolbarPluginKey.getState(state);
    }
  }
});
var _default = fakeCursorToolbarPlugin;
exports.default = _default;