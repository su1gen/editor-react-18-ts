import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export const pluginKey = new PluginKey('widthPlugin');
export function createPlugin(dispatch) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: () => ({
        width: document.body.offsetWidth,
        containerWidth: document.body.offsetWidth
      }),

      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);

        if (!meta) {
          return pluginState;
        }

        const newPluginState = { ...pluginState,
          ...meta
        };

        if (newPluginState && (pluginState.width !== newPluginState.width || pluginState.lineLength !== newPluginState.lineLength) || pluginState.containerWidth !== newPluginState.containerWidth) {
          dispatch(pluginKey, newPluginState);
          return newPluginState;
        }

        return pluginState;
      }

    }
  });
}

const widthPlugin = () => ({
  name: 'width',
  pmPlugins: () => [{
    name: 'width',
    plugin: ({
      dispatch
    }) => createPlugin(dispatch)
  }],

  // do this early here, otherwise we have to wait for WidthEmitter to debounce
  // which causes anything dependent on lineLength to jump around
  contentComponent({
    editorView,
    containerElement
  }) {
    const newState = {
      lineLength: editorView.dom.clientWidth
    };

    if (containerElement) {
      var _containerElement$par;

      newState.width = containerElement.offsetWidth; // wrapper width is used by context panel to determine whether there is
      // enough space to open without overlapping the editor

      newState.containerWidth = (_containerElement$par = containerElement.parentElement) === null || _containerElement$par === void 0 ? void 0 : _containerElement$par.offsetWidth;
    }

    const tr = editorView.state.tr.setMeta(pluginKey, newState);
    editorView.dispatch(tr);
    return null;
  }

});

export default widthPlugin;