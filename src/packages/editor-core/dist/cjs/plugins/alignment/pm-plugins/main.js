"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInitialPluginState = createInitialPluginState;
exports.createPlugin = createPlugin;
exports.pluginKey = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _commands = require("../commands");

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function createInitialPluginState(editorState, pluginConfig) {
  return {
    align: (0, _utils.getActiveAlignment)(editorState) || pluginConfig.align,
    isEnabled: true
  };
}

var pluginKey = new _prosemirrorState.PluginKey('alignmentPlugin');
exports.pluginKey = pluginKey;

function createPlugin(dispatch, pluginConfig) {
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    state: {
      init: function init(_config, editorState) {
        return createInitialPluginState(editorState, pluginConfig);
      },
      apply: function apply(_tr, state, _prevState, nextState) {
        var nextPluginState = (0, _utils.getActiveAlignment)(nextState);
        var isEnabled = (0, _commands.isAlignable)(nextPluginState)(nextState);

        var newState = _objectSpread(_objectSpread({}, state), {}, {
          align: nextPluginState,
          isEnabled: isEnabled
        });

        if (nextPluginState !== state.align || isEnabled !== state.isEnabled) {
          dispatch(pluginKey, newState);
        }

        return newState;
      }
    }
  });
}