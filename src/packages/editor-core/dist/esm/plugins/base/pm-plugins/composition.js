import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
var compositionPluginKey = new PluginKey('compositionPlugin');
export var isComposing = function isComposing(state) {
  return compositionPluginKey.getState(state).isComposing;
};
export default (function () {
  return new SafePlugin({
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
});