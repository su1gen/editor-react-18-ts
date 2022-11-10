"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isComposing = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var compositionPluginKey = new _prosemirrorState.PluginKey('compositionPlugin');

var isComposing = function isComposing(state) {
  return compositionPluginKey.getState(state).isComposing;
};

exports.isComposing = isComposing;

var _default = function _default() {
  return new _safePlugin.SafePlugin({
    key: compositionPluginKey,
    state: {
      init: function init() {
        return {
          isComposing: false
        };
      },
      apply: function apply(tr, value) {
        var isComposing = tr.getMeta(compositionPluginKey);

        if (typeof isComposing === 'undefined') {
          return value;
        }

        return {
          isComposing: isComposing
        };
      }
    },
    props: {
      handleDOMEvents: {
        compositionstart: function compositionstart(view, event) {
          var tr = view.state.tr;
          tr.setMeta(compositionPluginKey, true);
          view.dispatch(tr);
          return false;
        },
        compositionend: function compositionend(view, event) {
          var tr = view.state.tr;
          tr.setMeta(compositionPluginKey, false);
          view.dispatch(tr);
          return false;
        }
      }
    }
  });
};

exports.default = _default;