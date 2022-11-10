"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTIONS = void 0;
Object.defineProperty(exports, "DEFAULT_COLOR", {
  enumerable: true,
  get: function get() {
    return _color.DEFAULT_COLOR;
  }
});
exports.createInitialPluginState = createInitialPluginState;
exports.createPlugin = createPlugin;
exports.pluginKey = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _textColorPalette = require("../../../ui/ColorPalette/Palettes/textColorPalette");

var _common = require("../../../ui/ColorPalette/Palettes/common");

var _color = require("../utils/color");

var _disabled = require("../utils/disabled");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function createInitialPluginState(editorState, pluginConfig) {
  var defaultColor = (pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.defaultColor) || _color.DEFAULT_COLOR;
  var palette = [{
    value: defaultColor.color,
    label: defaultColor.label,
    border: _common.DEFAULT_BORDER_COLOR
  }].concat((0, _toConsumableArray2.default)(_textColorPalette.textColorPaletteExtended));
  var state = {
    color: (0, _color.getActiveColor)(editorState),
    disabled: (0, _disabled.getDisabledState)(editorState),
    palette: palette,
    defaultColor: defaultColor.color
  };
  return state;
}

var ACTIONS;
exports.ACTIONS = ACTIONS;

(function (ACTIONS) {
  ACTIONS[ACTIONS["RESET_COLOR"] = 0] = "RESET_COLOR";
  ACTIONS[ACTIONS["SET_COLOR"] = 1] = "SET_COLOR";
  ACTIONS[ACTIONS["DISABLE"] = 2] = "DISABLE";
})(ACTIONS || (exports.ACTIONS = ACTIONS = {}));

var pluginKey = new _prosemirrorState.PluginKey('textColorPlugin');
exports.pluginKey = pluginKey;

function createPlugin(dispatch, pluginConfig) {
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    state: {
      init: function init(_config, editorState) {
        return createInitialPluginState(editorState, pluginConfig);
      },
      apply: function apply(tr, pluginState, _, newState) {
        var meta = tr.getMeta(pluginKey) || {};
        var nextState;

        switch (meta.action) {
          case ACTIONS.RESET_COLOR:
            nextState = _objectSpread(_objectSpread({}, pluginState), {}, {
              color: pluginState.defaultColor
            });
            break;

          case ACTIONS.SET_COLOR:
            nextState = _objectSpread(_objectSpread({}, pluginState), {}, {
              color: meta.color,
              disabled: false
            });
            break;

          case ACTIONS.DISABLE:
            nextState = _objectSpread(_objectSpread({}, pluginState), {}, {
              disabled: true
            });
            break;

          default:
            nextState = _objectSpread(_objectSpread({}, pluginState), {}, {
              color: (0, _color.getActiveColor)(newState),
              disabled: (0, _disabled.getDisabledState)(newState)
            });
        }

        if (pluginState && pluginState.color !== nextState.color || pluginState && pluginState.disabled !== nextState.disabled) {
          dispatch(pluginKey, nextState);
          return nextState;
        }

        return pluginState;
      }
    }
  });
}