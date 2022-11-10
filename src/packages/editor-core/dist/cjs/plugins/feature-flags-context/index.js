"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFeatureFlags = exports.getFeatureFlags = exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _EditorContext = require("../../ui/EditorContext");

var _pluginKey = require("./plugin-key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var featureFlagsContextPlugin = function featureFlagsContextPlugin() {
  var featureFlags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'featureFlagsContext',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'featureFlagsContext',
        plugin: function plugin() {
          return new _safePlugin.SafePlugin({
            key: _pluginKey.pluginKey,
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

var getFeatureFlags = function getFeatureFlags(state) {
  return _pluginKey.pluginKey.getState(state);
};

exports.getFeatureFlags = getFeatureFlags;

var useFeatureFlags = function useFeatureFlags() {
  var _useEditorContext = (0, _EditorContext.useEditorContext)(),
      editorActions = _useEditorContext.editorActions;

  var editorView = editorActions === null || editorActions === void 0 ? void 0 : editorActions._privateGetEditorView();
  return editorView !== null && editorView !== void 0 && editorView.state ? _pluginKey.pluginKey.getState(editorView.state) : undefined;
};

exports.useFeatureFlags = useFeatureFlags;
var _default = featureFlagsContextPlugin;
exports.default = _default;