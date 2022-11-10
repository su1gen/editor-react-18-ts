import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { useEditorContext } from '../../ui/EditorContext';
import { pluginKey } from './plugin-key';

const featureFlagsContextPlugin = (featureFlags = {}) => ({
  name: 'featureFlagsContext',

  pmPlugins() {
    return [{
      name: 'featureFlagsContext',
      plugin: () => new SafePlugin({
        key: pluginKey,
        state: {
          init: () => ({ ...featureFlags
          }),
          apply: (_, pluginState) => pluginState
        }
      })
    }];
  }

});

export const getFeatureFlags = state => pluginKey.getState(state);
export const useFeatureFlags = () => {
  const {
    editorActions
  } = useEditorContext();
  const editorView = editorActions === null || editorActions === void 0 ? void 0 : editorActions._privateGetEditorView();
  return editorView !== null && editorView !== void 0 && editorView.state ? pluginKey.getState(editorView.state) : undefined;
};
export default featureFlagsContextPlugin;