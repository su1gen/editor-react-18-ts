"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapping = mapping;
exports.onSelectionChanged = onSelectionChanged;
exports.reducer = reducer;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorState = require("prosemirror-state");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function reducer(pluginState, meta) {
  // If the same nodeview is clicked twice, calendar should close
  if (meta.showDatePickerAt === pluginState.showDatePickerAt) {
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      showDatePickerAt: null
    });
  }

  var showDatePickerAt = pluginState.showDatePickerAt,
      isNew = pluginState.isNew;
  var showDatePickerAtMeta = meta.showDatePickerAt; // If date picker position has changed, it is no longer new

  if (showDatePickerAt && showDatePickerAtMeta && showDatePickerAt !== showDatePickerAtMeta && isNew) {
    return _objectSpread(_objectSpread(_objectSpread({}, pluginState), meta), {}, {
      isNew: false
    });
  }

  return _objectSpread(_objectSpread({}, pluginState), meta);
}

function mapping(tr, pluginState) {
  if (!pluginState.showDatePickerAt) {
    return pluginState;
  }

  var _tr$mapping$mapResult = tr.mapping.mapResult(pluginState.showDatePickerAt),
      pos = _tr$mapping$mapResult.pos;

  return {
    showDatePickerAt: pos,
    isNew: pluginState.isNew,
    isDateEmpty: pluginState.isDateEmpty,
    focusDateInput: pluginState.focusDateInput
  };
}

function onSelectionChanged(tr, pluginState) {
  if (tr.docChanged && isDateNodeSelection(tr.selection)) {
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      isQuickInsertAction: false,
      showDatePickerAt: tr.selection.from
    });
  } else if (!isDateNodeSelection(tr.selection) && !pluginState.isQuickInsertAction) {
    if (pluginState.showDatePickerAt) {
      return {
        showDatePickerAt: null,
        isNew: false,
        isDateEmpty: false,
        focusDateInput: false
      };
    }

    return pluginState;
  }

  return pluginState;
}

var isDateNodeSelection = function isDateNodeSelection(selection) {
  if (selection instanceof _prosemirrorState.NodeSelection) {
    var nodeTypeName = selection.node.type.name;
    return nodeTypeName === 'date';
  }

  return false;
};