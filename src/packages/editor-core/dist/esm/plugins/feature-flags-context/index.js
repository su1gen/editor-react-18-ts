import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { useEditorContext } from '../../ui/EditorContext';
import { pluginKey } from './plugin-key';

var featureFlagsContextPlugin = function featureFlagsContextPlugin() {
  var featureFlags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'featureFlagsContext',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'featureFlagsContext',
        plugin: function plugin() {
          return new SafePlugin({
            key: pluginKey,
            state: {
              init: function init() {
                return _objectSpread({}, featureFlags);
              },
              apply: function apply(_, pluginState) {
                return pluginState;
              }
            }
          });
        }
      }];
    }
  };
};

export var getFeatureFlags = function getFeatureFlags(state) {
  return pluginKey.getState(state);
};
export var useFeatureFlags = function useFeatureFlags() {
  var _useEditorContext = useEditorContext(),
      editorActions = _useEditorContext.editorActions;

  var editorView = editorActions === null || editorActions === void 0 ? void 0 : editorActions._privateGetEditorView();
  return editorView !== null && editorView !== void 0 && editorView.state ? pluginKey.getState(editorView.state) : undefined;
};
export default featureFlagsContextPlugin;