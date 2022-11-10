import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export var focusStateKey = new PluginKey('focusStatePlugin');
export default (function (dispatch) {
  return new SafePlugin({
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
});