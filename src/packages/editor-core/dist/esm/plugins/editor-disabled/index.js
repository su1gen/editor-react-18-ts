import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../utils/plugin-state-factory';
export var pluginKey = new PluginKey('editorDisabledPlugin');

function reducer(_pluginState, meta) {
  return meta;
}

var _pluginFactory = pluginFactory(pluginKey, reducer),
    createPluginState = _pluginFactory.createPluginState,
    getPluginState = _pluginFactory.getPluginState;
/*
Stores the state of the editor enabled/disabled for panel and floating
toolbar to subscribe to through <WithPluginState>. Otherwise the NodeViews
won't re-render when it changes.
*/


export function createPlugin(dispatch) {
  return new SafePlugin({
    key: pluginKey,
    state: createPluginState(dispatch, {
      editorDisabled: false
    }),
    view: function view() {
      return {
        update: function update(view) {
          if (getPluginState(view.state).editorDisabled !== !view.editable) {
            var tr = view.state.tr.setMeta(pluginKey, {
              editorDisabled: !view.editable
            });
            tr.setMeta('isLocal', true);
            view.dispatch(tr);
          }
        }
      };
    }
  });
}

var editorDisabledPlugin = function editorDisabledPlugin() {
  return {
    name: 'editorDisabled',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'editorDisabled',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch);
        }
      }];
    }
  };
};

export default editorDisabledPlugin;