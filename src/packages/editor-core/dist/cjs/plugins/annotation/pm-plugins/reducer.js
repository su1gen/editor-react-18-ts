"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _types = require("./types");

var _prosemirrorView = require("prosemirror-view");

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var _default = function _default(pluginState, action) {
  switch (action.type) {
    case _types.ACTIONS.UPDATE_INLINE_COMMENT_STATE:
      return _objectSpread(_objectSpread({}, pluginState), {}, {
        annotations: _objectSpread(_objectSpread({}, pluginState.annotations), action.data)
      });

    case _types.ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE:
      var mouseData = Object.assign({}, pluginState.mouseData, action.data.mouseData);
      return _objectSpread(_objectSpread({}, pluginState), {}, {
        mouseData: mouseData
      });

    case _types.ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE:
      return getNewDraftState(pluginState, action.data.drafting, action.data.editorState);

    case _types.ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK:
      return _objectSpread(_objectSpread({}, pluginState), {}, {
        dirtyAnnotations: false,
        annotations: {}
      });

    case _types.ACTIONS.CLOSE_COMPONENT:
      return _objectSpread(_objectSpread({}, pluginState), {}, {
        selectedAnnotations: []
      });

    case _types.ACTIONS.ADD_INLINE_COMMENT:
      var updatedPluginState = getNewDraftState(pluginState, action.data.drafting, action.data.editorState);
      return _objectSpread(_objectSpread({}, updatedPluginState), {}, {
        selectedAnnotations: [].concat((0, _toConsumableArray2.default)(updatedPluginState.selectedAnnotations), (0, _toConsumableArray2.default)(action.data.selectedAnnotations)),
        annotations: _objectSpread(_objectSpread({}, pluginState.annotations), action.data.inlineComments)
      });

    case _types.ACTIONS.INLINE_COMMENT_SET_VISIBLE:
      var isVisible = action.data.isVisible;

      if (isVisible === pluginState.isVisible) {
        return pluginState;
      }

      return _objectSpread(_objectSpread({}, isVisible ? pluginState : getNewDraftState(pluginState, false)), {}, {
        isVisible: isVisible
      });

    default:
      return pluginState;
  }
};

exports.default = _default;

function getNewDraftState(pluginState, drafting, editorState) {
  var draftDecorationSet = pluginState.draftDecorationSet;

  if (!draftDecorationSet || !drafting) {
    draftDecorationSet = _prosemirrorView.DecorationSet.empty;
  }

  var newState = _objectSpread(_objectSpread({}, pluginState), {}, {
    draftDecorationSet: draftDecorationSet
  });

  newState.bookmark = undefined;

  if (drafting && editorState) {
    newState.bookmark = editorState.selection.getBookmark();
    var resolvedBookmark = newState.bookmark.resolve(editorState.doc);
    var draftDecoration = (0, _utils.addDraftDecoration)(resolvedBookmark.from, resolvedBookmark.to);
    newState.draftDecorationSet = draftDecorationSet.add(editorState.doc, [draftDecoration]);
  }

  return newState;
}