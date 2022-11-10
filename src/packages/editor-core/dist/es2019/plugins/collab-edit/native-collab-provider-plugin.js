import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
const nativeCollabProviderPluginKey = new PluginKey('nativeCollabProviderPlugin');
export const nativeCollabProviderPlugin = ({
  providerPromise
}) => {
  return new SafePlugin({
    key: nativeCollabProviderPluginKey,
    state: {
      init: () => null,
      apply: (tr, currentPluginState) => {
        const provider = tr.getMeta(nativeCollabProviderPluginKey);
        return provider ? provider : currentPluginState;
      }
    },
    view: editorView => {
      providerPromise.then(provider => {
        const {
          dispatch,
          state
        } = editorView;
        const tr = state.tr;
        tr.setMeta(nativeCollabProviderPluginKey, provider);
        dispatch(tr);
      });
      return {};
    }
  });
};
export const getCollabProvider = editorState => {
  return nativeCollabProviderPluginKey.getState(editorState);
};