"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.createPlugin = void 0;
Object.defineProperty(exports, "insertMacroFromMacroBrowser", {
  enumerable: true,
  get: function get() {
    return _actions.insertMacroFromMacroBrowser;
  }
});
Object.defineProperty(exports, "resolveMacro", {
  enumerable: true,
  get: function get() {
    return _actions.resolveMacro;
  }
});
Object.defineProperty(exports, "runMacroAutoConvert", {
  enumerable: true,
  get: function get() {
    return _actions.runMacroAutoConvert;
  }
});
Object.defineProperty(exports, "setMacroProvider", {
  enumerable: true,
  get: function get() {
    return _actions.setMacroProvider;
  }
});

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _actions = require("./actions");

var _pluginKey = require("./plugin-key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var createPlugin = function createPlugin(dispatch, providerFactory) {
  return new _safePlugin.SafePlugin({
    state: {
      init: function init() {
        return {
          macroProvider: null
        };
      },
      apply: function apply(tr, state) {
        var meta = tr.getMeta(_pluginKey.pluginKey);

        if (meta) {
          var newState = _objectSpread(_objectSpread({}, state), meta);

          dispatch(_pluginKey.pluginKey, newState);
          return newState;
        }

        return state;
      }
    },
    key: _pluginKey.pluginKey,
    view: function view(_view) {
      var handleProvider = function handleProvider(_name, provider) {
        return provider && (0, _actions.setMacroProvider)(provider)(_view);
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

exports.createPlugin = createPlugin;

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

var _default = macroPlugin;
exports.default = _default;