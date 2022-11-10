import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { ACTIONS } from './types';
import { DecorationSet } from 'prosemirror-view';
import { addDraftDecoration } from '../utils';
export default (function (pluginState, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_INLINE_COMMENT_STATE:
      return _objectSpread(_objectSpread({}, pluginState), {}, {
        annotations: _objectSpread(_objectSpread({}, pluginState.annotations), action.data)
      });

    case ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE:
      var mouseData = Object.assign({}, pluginState.mouseData, action.data.mouseData);
      return _objectSpread(_objectSpread({}, pluginState), {}, {
        mouseData: mouseData
      });

    case ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE:
      return getNewDraftState(pluginState, action.data.drafting, action.data.editorState);

    case ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK:
      return _objectSpread(_objectSpread({}, pluginState), {}, {
        dirtyAnnotations: false,
        annotations: {}
      });

    case ACTIONS.CLOSE_COMPONENT:
      return _objectSpread(_objectSpread({}, pluginState), {}, {
        selectedAnnotations: []
      });

    case ACTIONS.ADD_INLINE_COMMENT:
      var updatedPluginState = getNewDraftState(pluginState, action.data.drafting, action.data.editorState);
      return _objectSpread(_objectSpread({}, updatedPluginState), {}, {
        selectedAnnotations: [].concat(_toConsumableArray(updatedPluginState.selectedAnnotations), _toConsumableArray(action.data.selectedAnnotations)),
        annotations: _objectSpread(_objectSpread({}, pluginState.annotations), action.data.inlineComments)
      });

    case ACTIONS.INLINE_COMMENT_SET_VISIBLE:
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
});

function getNewDraftState(pluginState, drafting, editorState) {
  var draftDecorationSet = pluginState.draftDecorationSet;

  if (!draftDecorationSet || !drafting) {
    draftDecorationSet = DecorationSet.empty;
  }

  var newState = _objectSpread(_objectSpread({}, pluginState), {}, {
    draftDecorationSet: draftDecorationSet
  });

  newState.bookmark = undefined;

  if (drafting && editorState) {
    newState.bookmark = editorState.selection.getBookmark();
    var resolvedBookmark = newState.bookmark.resolve(editorState.doc);
    var draftDecoration = addDraftDecoration(resolvedBookmark.from, resolvedBookmark.to);
    newState.draftDecorationSet = draftDecorationSet.add(editorState.doc, [draftDecoration]);
  }

  return newState;
}