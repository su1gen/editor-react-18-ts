"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPluginState = exports.createCommand = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pluginStateFactory = require("../../../utils/plugin-state-factory");

var _utils = require("../utils");

var _reducer = _interopRequireDefault(require("./reducer"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var handleDocChanged = function handleDocChanged(tr, prevPluginState) {
  if (!tr.getMeta('replaceDocument')) {
    return handleSelectionChanged(tr, prevPluginState);
  }

  return _objectSpread(_objectSpread({}, prevPluginState), {}, {
    dirtyAnnotations: true
  });
};

var handleSelectionChanged = function handleSelectionChanged(tr, pluginState) {
  var selectedAnnotations = (0, _utils.findAnnotationsInSelection)(tr.selection, tr.doc);
  var changed = selectedAnnotations.length !== pluginState.selectedAnnotations.length || selectedAnnotations.some(function (annotationInfo) {
    return !pluginState.selectedAnnotations.some(function (aInfo) {
      return aInfo.type === annotationInfo.id;
    });
  });

  if (changed) {
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      selectedAnnotations: selectedAnnotations
    });
  }

  return pluginState;
};

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(_utils.inlineCommentPluginKey, _reducer.default, {
  onSelectionChanged: handleSelectionChanged,
  onDocChanged: handleDocChanged,
  mapping: function mapping(tr, pluginState) {
    var draftDecorationSet = pluginState.draftDecorationSet,
        bookmark = pluginState.bookmark;
    var mappedDecorationSet, mappedBookmark;

    if (draftDecorationSet) {
      mappedDecorationSet = draftDecorationSet.map(tr.mapping, tr.doc);
    }

    if (bookmark) {
      mappedBookmark = bookmark.map(tr.mapping);
    } // return same pluginState if mappings did not change


    if (mappedBookmark === bookmark && mappedDecorationSet === draftDecorationSet) {
      return pluginState;
    }

    return _objectSpread(_objectSpread({}, pluginState), {}, {
      draftDecorationSet: mappedDecorationSet,
      bookmark: mappedBookmark
    });
  }
}),
    createPluginState = _pluginFactory.createPluginState,
    createCommand = _pluginFactory.createCommand;

exports.createCommand = createCommand;
exports.createPluginState = createPluginState;