import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
const compositionPluginKey = new PluginKey('compositionPlugin');
export const isComposing = state => {
  return compositionPluginKey.getState(state).isComposing;
};
export default (() => new SafePlugin({
  key: compositionPluginKey,
  state: {
    init: () => ({
      isComposing: false
    }),
    apply: (tr, value) => {
      const isComposing = tr.getMeta(compositionPluginKey);

      if (typeof isComposing === 'undefined') {
        return value;
      }

      return {
        isComposing
      };
    }
  },
  props: {
    handleDOMEvents: {
      compositionstart: (view, event) => {
        const {
          tr
        } = view.state;
        tr.setMeta(compositionPluginKey, true);
        view.dispatch(tr);
        return false;
      },
      compositionend: (view, event) => {
        const {
          tr
        } = view.state;
        tr.setMeta(compositionPluginKey, false);
        view.dispatch(tr);
        return false;
      }
    }
  }
}));