import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export var pluginKey = new PluginKey('contextPanelPluginKey');
export function getPluginState(state) {
  return pluginKey.getState(state);
}

function contextPanelPluginFactory(contextPanels, dispatch) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init(_config, state) {
        return {
          handlers: contextPanels,
          contents: contextPanels.map(function (panelContent) {
            return panelContent(state);
          })
        };
      },
      apply: function apply(tr, pluginState, _oldState, newState) {
        var newPluginState = pluginState;
        var meta = tr.getMeta(pluginKey);

        if (tr.docChanged || tr.selectionSet || meta && meta.changed) {
          var newContents = pluginState.handlers.map(function (panelContent) {
            return panelContent(newState);
          });

          if (newContents.length !== newPluginState.contents.length || newContents.some(function (node) {
            return newPluginState.contents.indexOf(node) < 0;
          })) {
            newPluginState = _objectSpread(_objectSpread({}, newPluginState), {}, {
              contents: newContents
            });
          }
        }

        if (newPluginState !== pluginState) {
          dispatch(pluginKey, newPluginState);
        }

        return newPluginState;
      }
    }
  });
}

var contextPanelPlugin = function contextPanelPlugin() {
  return {
    name: 'contextPanel',
    pmPlugins: function pmPlugins() {
      var contextPanels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return [{
        name: 'contextPanel',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return contextPanelPluginFactory(contextPanels.filter(Boolean), dispatch);
        }
      }];
    }
  };
};

export default contextPanelPlugin;