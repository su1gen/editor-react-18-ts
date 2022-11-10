"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.getPluginState = exports.createPluginState = exports.createCommand = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _prosemirrorState = require("prosemirror-state");

var _pluginStateFactory = require("../../../utils/plugin-state-factory");

var _reducer = require("../reducer");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var pluginKey = new _prosemirrorState.PluginKey('pastePlugin');
exports.pluginKey = pluginKey;

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(pluginKey, _reducer.reducer, {
  mapping: function mapping(tr, pluginState) {
    if (tr.docChanged) {
      var atLeastOnePositionChanged = false;
      var positionsMappedThroughChanges = Object.entries(pluginState.pastedMacroPositions).reduce(function (acc, _ref) {
        var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
            key = _ref2[0],
            position = _ref2[1];

        var mappedPosition = tr.mapping.map(position);

        if (position !== mappedPosition) {
          atLeastOnePositionChanged = true;
        }

        acc[key] = tr.mapping.map(position);
        return acc;
      }, {});

      if (atLeastOnePositionChanged) {
        return _objectSpread(_objectSpread({}, pluginState), {}, {
          pastedMacroPositions: positionsMappedThroughChanges
        });
      }
    }

    return pluginState;
  }
}),
    createPluginState = _pluginFactory.createPluginState,
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState;

exports.getPluginState = getPluginState;
exports.createCommand = createCommand;
exports.createPluginState = createPluginState;