"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focusStateKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var focusStateKey = new _prosemirrorState.PluginKey('focusStatePlugin');
exports.focusStateKey = focusStateKey;

var _default = function _default(dispatch) {
  return new _safePlugin.SafePlugin({
    key: focusStateKey,
    state: {
      init: function init() {
        return true;
      },
      apply: function apply(tr, wasEditorFocused) {
        var meta = tr.getMeta(focusStateKey);

        if (typeof meta === 'boolean') {
          if (meta !== wasEditorFocused) {
            dispatch(focusStateKey, meta);
            return meta;
          }
        }

        return wasEditorFocused;
      }
    },
    props: {
      handleDOMEvents: {
        click: function click(view) {
          var isEditorFocused = focusStateKey.getState(view.state);

          if (!isEditorFocused) {
            view.dispatch(view.state.tr.setMeta(focusStateKey, view.hasFocus()));
          }

          return false;
        },
        focus: function focus(view) {
          var isEditorFocused = focusStateKey.getState(view.state);

          if (!isEditorFocused) {
            view.dispatch(view.state.tr.setMeta(focusStateKey, true));
          }

          return false;
        },
        blur: function blur(view) {
          var isEditorFocused = focusStateKey.getState(view.state);

          if (isEditorFocused) {
            view.dispatch(view.state.tr.setMeta(focusStateKey, false));
          }

          return false;
        }
      }
    }
  });
};

exports.default = _default;