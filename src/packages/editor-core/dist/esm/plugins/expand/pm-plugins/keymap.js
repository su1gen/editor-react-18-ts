import { keymap } from 'prosemirror-keymap';
import { Selection, TextSelection, NodeSelection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { GapCursorSelection, Side } from '../../selection/gap-cursor-selection';
import { findExpand } from '../utils';
import { isEmptyNode } from '../../../utils';
import { expandClassNames } from '../ui/class-names';
import { deleteExpand, focusTitle } from '../commands';
import { getPluginState as getSelectionPluginState } from '../../selection/plugin-factory';
import { RelativeSelectionPos } from '../../selection/types';

var isExpandNode = function isExpandNode(node) {
  return (node === null || node === void 0 ? void 0 : node.type.name) === 'expand' || (node === null || node === void 0 ? void 0 : node.type.name) === 'nestedExpand';
};

var isExpandSelected = function isExpandSelected(selection) {
  return selection instanceof NodeSelection && isExpandNode(selection.node);
};

export function expandKeymap() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.moveRight.common, function (state, dispatch, editorView) {
    if (!editorView) {
      return false;
    }

    var selection = state.selection;

    var _getSelectionPluginSt = getSelectionPluginState(state),
        selectionRelativeToNode = _getSelectionPluginSt.selectionRelativeToNode;

    if (isExpandSelected(selection) && selectionRelativeToNode === RelativeSelectionPos.Start) {
      return focusTitle(selection.from + 1)(state, dispatch, editorView);
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.moveLeft.common, function (state, dispatch, editorView) {
    if (!editorView) {
      return false;
    }

    var selection = state.selection;

    var _getSelectionPluginSt2 = getSelectionPluginState(state),
        selectionRelativeToNode = _getSelectionPluginSt2.selectionRelativeToNode;

    if (isExpandSelected(selection) && (selectionRelativeToNode === undefined || selectionRelativeToNode === RelativeSelectionPos.End)) {
      return focusTitle(selection.from + 1)(state, dispatch, editorView);
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.tab.common, function (state, dispatch, editorView) {
    if (state.selection instanceof NodeSelection && state.selection.node.type === state.schema.nodes.expand && editorView && editorView.dom instanceof HTMLElement) {
      var from = state.selection.from;
      var expand = editorView.nodeDOM(from);

      if (!expand || !(expand instanceof HTMLElement)) {
        return false;
      }

      var iconContainer = expand.querySelector(".".concat(expandClassNames.iconContainer));

      if (iconContainer && iconContainer.focus) {
        var tr = state.tr;
        var pos = state.selection.from;
        tr.setSelection(new TextSelection(tr.doc.resolve(pos)));

        if (dispatch) {
          dispatch(tr);
        }

        editorView.dom.blur();
        iconContainer.focus();
      }

      return true;
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.moveUp.common, function (state, dispatch, editorView) {
    if (!editorView) {
      return false;
    }

    var selection = state.selection,
        schema = state.schema;
    var nodeBefore = selection.$from.nodeBefore;

    if (selection instanceof GapCursorSelection && selection.side === Side.RIGHT && nodeBefore && (nodeBefore.type === schema.nodes.expand || nodeBefore.type === schema.nodes.nestedExpand) && !nodeBefore.attrs.__expanded) {
      var _$from = selection.$from;
      return focusTitle(Math.max(_$from.pos - 1, 0))(state, dispatch, editorView);
    }

    var $from = state.selection.$from;

    if (editorView.endOfTextblock('up')) {
      var expand = findExpand(state);
      var prevCursorPos = Math.max($from.pos - $from.parentOffset - 1, 0); // move cursor from expand's content to its title

      if (expand && expand.start === prevCursorPos) {
        return focusTitle(expand.start)(state, dispatch, editorView);
      }

      var sel = Selection.findFrom(state.doc.resolve(prevCursorPos), -1);
      var expandBefore = findExpand(state, sel);

      if (sel && expandBefore) {
        // moving cursor from outside of an expand to the title when it is collapsed
        if (!expandBefore.node.attrs.__expanded) {
          return focusTitle(expandBefore.start)(state, dispatch, editorView);
        } // moving cursor from outside of an expand to the content when it is expanded
        else if (dispatch) {
          dispatch(state.tr.setSelection(sel));
        }

        return true;
      }
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, function (state, dispatch, editorView) {
    if (!editorView) {
      return false;
    }

    var _state$schema$nodes = state.schema.nodes,
        expand = _state$schema$nodes.expand,
        nestedExpand = _state$schema$nodes.nestedExpand;
    var selection = state.selection;
    var nodeAfter = selection.$from.nodeAfter;

    if (selection instanceof GapCursorSelection && selection.side === Side.LEFT && nodeAfter && (nodeAfter.type === expand || nodeAfter.type === nestedExpand) && !nodeAfter.attrs.__expanded) {
      var $from = selection.$from;
      return focusTitle($from.pos + 1)(state, dispatch, editorView);
    }

    if (editorView.endOfTextblock('down')) {
      var _$from2 = state.selection.$from;
      var $after = state.doc.resolve(_$from2.after());

      if ($after.nodeAfter && ($after.nodeAfter.type === expand || $after.nodeAfter.type === nestedExpand)) {
        return focusTitle($after.pos + 1)(state, dispatch, editorView);
      }
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.backspace.common, function (state, dispatch, editorView) {
    var selection = state.selection;
    var $from = selection.$from;

    if (!editorView || !selection.empty) {
      return false;
    }

    var _state$schema$nodes2 = state.schema.nodes,
        expand = _state$schema$nodes2.expand,
        nestedExpand = _state$schema$nodes2.nestedExpand;
    var expandNode = findExpand(state);

    if (!expandNode) {
      // @see ED-7977
      var sel = Selection.findFrom(state.doc.resolve(Math.max(selection.$from.pos - 1, 0)), -1);
      var expandBefore = findExpand(state, sel);

      if (expandBefore && (expandBefore.node.type === expand || expandBefore.node.type === nestedExpand) && !expandBefore.node.attrs.__expanded) {
        return focusTitle(expandBefore.start)(state, dispatch, editorView);
      }

      return false;
    }

    var parentNode = state.doc.nodeAt($from.before(Math.max($from.depth - 1, 1))); // ED-10012 catch cases where the expand has another node nested within it and
    // the backspace should be applied only to the inner node instead of the expand

    if (parentNode && !isExpandNode(parentNode)) {
      return false;
    }

    var textSel = Selection.findFrom(state.doc.resolve(expandNode.pos), 1, true);

    if (textSel && selection.$from.pos === textSel.$from.pos && isEmptyNode(state.schema)(expandNode.node) && dispatch) {
      return deleteExpand()(state, dispatch);
    }

    return false;
  }, list);
  return keymap(list);
}