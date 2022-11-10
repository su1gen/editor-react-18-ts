"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.captionKeymap = captionKeymap;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorState = require("prosemirror-state");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _prosemirrorUtils = require("prosemirror-utils");

var _commands = require("../../../commands");

var _selection = require("../../selection/gap-cursor/selection");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function captionKeymap() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, createNewParagraphBelowCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, createNewParagraphBelowCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, getOutOfCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, getOutOfCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.moveUp.common, selectParentMediaSingle, list);
  keymaps.bindKeymapWithCommand(keymaps.shiftTab.common, selectParentMediaSingle, list);
  keymaps.bindKeymapWithCommand(keymaps.tab.common, getOutOfCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.moveLeft.common, gapCursorSelectLeftParentMediaSingle, list);
  return (0, _prosemirrorKeymap.keymap)(list);
}

var createNewParagraphBelowCaption = function createNewParagraphBelowCaption(state, dispatch) {
  var caption = (0, _prosemirrorUtils.findParentNodeOfType)(state.schema.nodes.caption)(state.selection);

  if (caption) {
    return (0, _commands.createNewParagraphBelow)(state, dispatch);
  }

  return false;
};

var getOutOfCaption = function getOutOfCaption(state, dispatch) {
  var caption = (0, _prosemirrorUtils.findParentNodeOfType)(state.schema.nodes.caption)(state.selection);

  if (caption) {
    if (dispatch) {
      var tr = state.tr.setSelection(_prosemirrorState.Selection.near(state.tr.doc.resolve(caption.pos + caption.node.nodeSize)));
      dispatch(tr);
    }

    return true;
  }

  return false;
};

var selectParentMediaSingle = function selectParentMediaSingle(state, dispatch) {
  if ((0, _prosemirrorUtils.findParentNodeOfType)(state.schema.nodes.caption)(state.selection)) {
    var mediaSingleParent = (0, _prosemirrorUtils.findParentNodeOfType)(state.schema.nodes.mediaSingle)(state.selection);

    if (mediaSingleParent) {
      if (dispatch) {
        var tr = state.tr.setSelection(_prosemirrorState.Selection.near(state.tr.doc.resolve(mediaSingleParent.pos)));
        dispatch(tr);
      }

      return true;
    }
  }

  return false;
};

var gapCursorSelectLeftParentMediaSingle = function gapCursorSelectLeftParentMediaSingle(state, dispatch) {
  var caption = (0, _prosemirrorUtils.findParentNodeOfType)(state.schema.nodes.caption)(state.selection);

  if (caption) {
    var mediaSingleParent = (0, _prosemirrorUtils.findParentNodeOfType)(state.schema.nodes.mediaSingle)(state.selection);

    if (mediaSingleParent && state.selection.empty && state.tr.doc.resolve(state.selection.from).parentOffset === 0) {
      var gapCursorSelection = _selection.GapCursorSelection.findFrom(state.tr.doc.resolve(mediaSingleParent.pos), 0, false);

      if (gapCursorSelection) {
        if (dispatch) {
          var tr = state.tr.setSelection(gapCursorSelection);
          dispatch(tr);
        }

        return true;
      }
    }
  }

  return false;
};