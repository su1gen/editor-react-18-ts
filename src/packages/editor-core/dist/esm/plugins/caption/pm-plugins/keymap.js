import { keymap } from 'prosemirror-keymap';
import { Selection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { findParentNodeOfType } from 'prosemirror-utils';
import { createNewParagraphBelow } from '../../../commands';
import { GapCursorSelection } from '../../selection/gap-cursor/selection';
export function captionKeymap() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, createNewParagraphBelowCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, createNewParagraphBelowCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, getOutOfCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, getOutOfCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.moveUp.common, selectParentMediaSingle, list);
  keymaps.bindKeymapWithCommand(keymaps.shiftTab.common, selectParentMediaSingle, list);
  keymaps.bindKeymapWithCommand(keymaps.tab.common, getOutOfCaption, list);
  keymaps.bindKeymapWithCommand(keymaps.moveLeft.common, gapCursorSelectLeftParentMediaSingle, list);
  return keymap(list);
}

var createNewParagraphBelowCaption = function createNewParagraphBelowCaption(state, dispatch) {
  var caption = findParentNodeOfType(state.schema.nodes.caption)(state.selection);

  if (caption) {
    return createNewParagraphBelow(state, dispatch);
  }

  return false;
};

var getOutOfCaption = function getOutOfCaption(state, dispatch) {
  var caption = findParentNodeOfType(state.schema.nodes.caption)(state.selection);

  if (caption) {
    if (dispatch) {
      var tr = state.tr.setSelection(Selection.near(state.tr.doc.resolve(caption.pos + caption.node.nodeSize)));
      dispatch(tr);
    }

    return true;
  }

  return false;
};

var selectParentMediaSingle = function selectParentMediaSingle(state, dispatch) {
  if (findParentNodeOfType(state.schema.nodes.caption)(state.selection)) {
    var mediaSingleParent = findParentNodeOfType(state.schema.nodes.mediaSingle)(state.selection);

    if (mediaSingleParent) {
      if (dispatch) {
        var tr = state.tr.setSelection(Selection.near(state.tr.doc.resolve(mediaSingleParent.pos)));
        dispatch(tr);
      }

      return true;
    }
  }

  return false;
};

var gapCursorSelectLeftParentMediaSingle = function gapCursorSelectLeftParentMediaSingle(state, dispatch) {
  var caption = findParentNodeOfType(state.schema.nodes.caption)(state.selection);

  if (caption) {
    var mediaSingleParent = findParentNodeOfType(state.schema.nodes.mediaSingle)(state.selection);

    if (mediaSingleParent && state.selection.empty && state.tr.doc.resolve(state.selection.from).parentOffset === 0) {
      var gapCursorSelection = GapCursorSelection.findFrom(state.tr.doc.resolve(mediaSingleParent.pos), 0, false);

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