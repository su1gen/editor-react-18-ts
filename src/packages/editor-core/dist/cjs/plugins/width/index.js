"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.pluginKey = exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var pluginKey = new _prosemirrorState.PluginKey('widthPlugin');
exports.pluginKey = pluginKey;

function createPlugin(dispatch) {
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    state: {
      init: function init() {
        return {
          width: document.body.offsetWidth,
          containerWidth: document.body.offsetWidth
        };
      },
      apply: function apply(tr, pluginState) {
        var meta = tr.getMeta(pluginKey);

        if (!meta) {
          return pluginState;
        }

        var newPluginState = _objectSpread(_objectSpread({}, pluginState), meta);

        if (newPluginState && (pluginState.width !== newPluginState.width || pluginState.lineLength !== newPluginState.lineLength) || pluginState.containerWidth !== newPluginState.containerWidth) {
          dispatch(pluginKey, newPluginState);
          return newPluginState;
        }

        return pluginState;
      }
    }
  });
}

var widthPlugin = function widthPlugin() {
  return {
    name: 'width',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'width',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch);
        }
      }];
    },
    // do this early here, otherwise we have to wait for WidthEmitter to debounce
    // which causes anything dependent on lineLength to jump around
    contentComponent: function contentComponent(_ref2) {
      var editorView = _ref2.editorView,
          containerElement = _ref2.containerElement;
      var newState = {
        lineLength: editorView.dom.clientWidth
      };

      if (containerElement) {
        var _containerElement$par;

        newState.width = containerElement.offsetWidth; // wrapper width is used by context panel to determine whether there is
        // enough space to open without overlapping the editor

        newState.containerWidth = (_containerElement$par = containerElement.parentElement) === null || _containerElement$par === void 0 ? void 0 : _containerElement$par.offsetWidth;
      }

      var tr = editorView.state.tr.setMeta(pluginKey, newState);
      editorView.dispatch(tr);
      return null;
    }
  };
};

var _default = widthPlugin;
exports.default = _default;