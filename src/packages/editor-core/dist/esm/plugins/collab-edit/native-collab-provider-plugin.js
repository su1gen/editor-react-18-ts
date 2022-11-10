import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
var nativeCollabProviderPluginKey = new PluginKey('nativeCollabProviderPlugin');
export var nativeCollabProviderPlugin = function nativeCollabProviderPlugin(_ref) {
  var providerPromise = _ref.providerPromise;
  return new SafePlugin({
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
export var getCollabProvider = function getCollabProvider(editorState) {
  return nativeCollabProviderPluginKey.getState(editorState);
};