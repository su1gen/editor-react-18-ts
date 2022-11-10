import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { setMacroProvider } from './actions';
import { pluginKey } from './plugin-key';
export { insertMacroFromMacroBrowser, resolveMacro, runMacroAutoConvert, setMacroProvider } from './actions';
export var createPlugin = function createPlugin(dispatch, providerFactory) {
  return new SafePlugin({
    state: {
      init: function init() {
        return {
          macroProvider: null
        };
      },
      apply: function apply(tr, state) {
        var meta = tr.getMeta(pluginKey);

        if (meta) {
          var newState = _objectSpread(_objectSpread({}, state), meta);

          dispatch(pluginKey, newState);
          return newState;
        }

        return state;
      }
    },
    key: pluginKey,
    view: function view(_view) {
      var handleProvider = function handleProvider(_name, provider) {
        return provider && setMacroProvider(provider)(_view);
      }; // make sure editable DOM node is mounted


      if (_view.dom.parentNode) {
        providerFactory.subscribe('macroProvider', handleProvider);
      }

      return {
        destroy: function destroy() {
          providerFactory.unsubscribe('macroProvider', handleProvider);
        }
      };
    }
  });
};

var macroPlugin = function macroPlugin() {
  return {
    name: 'macro',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'macro',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              providerFactory = _ref.providerFactory;
          return createPlugin(dispatch, providerFactory);
        }
      }];
    }
  };
};

export default macroPlugin;