"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nativeCollabProviderPlugin = exports.getCollabProvider = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var nativeCollabProviderPluginKey = new _prosemirrorState.PluginKey('nativeCollabProviderPlugin');

var nativeCollabProviderPlugin = function nativeCollabProviderPlugin(_ref) {
  var providerPromise = _ref.providerPromise;
  return new _safePlugin.SafePlugin({
    key: nativeCollabProviderPluginKey,
    state: {
      init: function init() {
        return null;
      },
      apply: function apply(tr, currentPluginState) {
        var provider = tr.getMeta(nativeCollabProviderPluginKey);
        return provider ? provider : currentPluginState;
      }
    },
    view: function view(editorView) {
      providerPromise.then(function (provider) {
        var dispatch = editorView.dispatch,
            state = editorView.state;
        var tr = state.tr;
        tr.setMeta(nativeCollabProviderPluginKey, provider);
        dispatch(tr);
      });
      return {};
    }
  });
};

exports.nativeCollabProviderPlugin = nativeCollabProviderPlugin;

var getCollabProvider = function getCollabProvider(editorState) {
  return nativeCollabProviderPluginKey.getState(editorState);
};

exports.getCollabProvider = getCollabProvider;