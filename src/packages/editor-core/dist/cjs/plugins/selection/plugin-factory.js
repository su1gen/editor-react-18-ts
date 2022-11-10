"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluginState = exports.createPluginState = exports.createCommand = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _cellSelection = require("@atlaskit/editor-tables/cell-selection");

var _pluginStateFactory = require("../../utils/plugin-state-factory");

var _reducer = require("./reducer");

var _types = require("./types");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var handleDocChanged = function handleDocChanged(tr, pluginState) {
  // in some collab edge cases mapping decorations could throw an error
  try {
    if (pluginState.decorationSet.find().length === 0 && (!tr.selectionSet || (0, _utils.getDecorations)(tr).find().length === 0)) {
      return pluginState;
    }

    var decorationSet = pluginState.decorationSet.map(tr.mapping, tr.doc);
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      decorationSet: decorationSet
    });
  } catch (error) {
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      decorationSet: _prosemirrorView.DecorationSet.empty
    });
  }
};

var handleSelectionChanged = function handleSelectionChanged(tr, pluginState) {
  // Reset relative selection pos when user clicks to select a node
  if ((tr.selection instanceof _prosemirrorState.NodeSelection && (0, _utils.isSelectableContainerNode)(tr.selection.node) || tr.selection instanceof _cellSelection.CellSelection) && !tr.getMeta(_types.selectionPluginKey)) {
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      selectionRelativeToNode: undefined
    });
  }

  return pluginState;
};

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(_types.selectionPluginKey, _reducer.reducer, {
  onDocChanged: handleDocChanged,
  onSelectionChanged: handleSelectionChanged
}),
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState,
    createPluginState = _pluginFactory.createPluginState;

exports.createPluginState = createPluginState;
exports.getPluginState = getPluginState;
exports.createCommand = createCommand;