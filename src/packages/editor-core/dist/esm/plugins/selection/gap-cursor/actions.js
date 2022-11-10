import _defineProperty from "@babel/runtime/helpers/defineProperty";

var _mapDirection;

import { Selection, TextSelection, NodeSelection } from 'prosemirror-state';
import { removeNodeBefore, findDomRefAtPos } from 'prosemirror-utils';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';
import { Direction, isBackward, isForward } from './direction';
import { GapCursorSelection, Side } from './selection';
import { isTextBlockNearPos, getMediaNearPos } from './utils';
import { isValidTargetNode } from './utils/is-valid-target-node';
import { atTheBeginningOfDoc, atTheEndOfDoc } from '../../../utils/prosemirror/position';
import { gapCursorPluginKey } from '../pm-plugins/gap-cursor-plugin-key';
var mapDirection = (_mapDirection = {}, _defineProperty(_mapDirection, Direction.LEFT, -1), _defineProperty(_mapDirection, Direction.RIGHT, 1), _defineProperty(_mapDirection, Direction.UP, -1), _defineProperty(_mapDirection, Direction.DOWN, 1), _defineProperty(_mapDirection, Direction.BACKWARD, -1), _defineProperty(_mapDirection, Direction.FORWARD, 1), _mapDirection);

function shouldHandleMediaGapCursor(dir, state) {
  var doc = state.doc,
      schema = state.schema,
      selection = state.selection;
  var $pos = isBackward(dir) ? selection.$from : selection.$to;

  if (selection instanceof TextSelection) {
    // Should not use gap cursor if I am moving from a text selection into a media node
    if (dir === Direction.UP && !atTheBeginningOfDoc(state) || dir === Direction.DOWN && !atTheEndOfDoc(state)) {
      var media = getMediaNearPos(doc, $pos, schema, mapDirection[dir]);

      if (media) {
        return false;
      }
    } // Should not use gap cursor if I am moving from a text selection into a media node with layout wrap-right or wrap-left


    if (dir === Direction.LEFT || dir === Direction.RIGHT) {
      var _media = getMediaNearPos(doc, $pos, schema, mapDirection[dir]);

      var mediaSingle = schema.nodes.mediaSingle;

      if (_media && _media.type === mediaSingle && (_media.attrs.layout === 'wrap-right' || _media.attrs.layout === 'wrap-left')) {
        return false;
      }
    }
  }

  if (selection instanceof NodeSelection) {
    // Should not use gap cursor if I am moving left/right from media node with layout wrap right or wrap-left
    if (dir === Direction.LEFT || dir === Direction.RIGHT) {
      var maybeMedia = doc.nodeAt(selection.$from.pos);
      var _mediaSingle = schema.nodes.mediaSingle;

      if (maybeMedia && maybeMedia.type === _mediaSingle && (maybeMedia.attrs.layout === 'wrap-right' || maybeMedia.attrs.layout === 'wrap-left')) {
        return false;
      }
    }
  }

  return true;
}

export var arrow = function arrow(dir, endOfTextblock) {
  return function (state, dispatch, view) {
    var doc = state.doc,
        schema = state.schema,
        selection = state.selection,
        tr = state.tr;
    var $pos = isBackward(dir) ? selection.$from : selection.$to;
    var mustMove = selection.empty; // start from text selection

    if (selection instanceof TextSelection) {
      // if cursor is in the middle of a text node, do nothing
      if (!endOfTextblock || !endOfTextblock(dir.toString())) {
        return false;
      } // UP/DOWN jumps to the nearest texblock skipping gapcursor whenever possible


      if (dir === Direction.UP && !atTheBeginningOfDoc(state) && isTextBlockNearPos(doc, schema, $pos, -1) || dir === Direction.DOWN && (atTheEndOfDoc(state) || isTextBlockNearPos(doc, schema, $pos, 1))) {
        return false;
      } // otherwise resolve previous/next position


      $pos = doc.resolve(isBackward(dir) ? $pos.before() : $pos.after());
      mustMove = false;
    }

    if (selection instanceof NodeSelection) {
      if (selection.node.isInline) {
        return false;
      }

      if (dir === Direction.UP || dir === Direction.DOWN) {
        // We dont add gap cursor on node selections going up and down
        return false;
      }
    }

    if (!shouldHandleMediaGapCursor(dir, state)) {
      return false;
    } // when jumping between block nodes at the same depth, we need to reverse cursor without changing ProseMirror position


    if (selection instanceof GapCursorSelection && // next node allow gap cursor position
    isValidTargetNode(isBackward(dir) ? $pos.nodeBefore : $pos.nodeAfter) && ( // gap cursor changes block node
    isBackward(dir) && selection.side === Side.LEFT || isForward(dir) && selection.side === Side.RIGHT)) {
      // reverse cursor position
      if (dispatch) {
        dispatch(tr.setSelection(new GapCursorSelection($pos, selection.side === Side.RIGHT ? Side.LEFT : Side.RIGHT)).scrollIntoView());
      }

      return true;
    }

    if (view) {
      var domAtPos = view.domAtPos.bind(view);
      var target = findDomRefAtPos($pos.pos, domAtPos);

      if (target && target.textContent === ZERO_WIDTH_SPACE) {
        return false;
      }
    }

    var nextSelection = GapCursorSelection.findFrom($pos, isBackward(dir) ? -1 : 1, mustMove);

    if (!nextSelection) {
      return false;
    }

    if (!isValidTargetNode(isForward(dir) ? nextSelection.$from.nodeBefore : nextSelection.$from.nodeAfter)) {
      // reverse cursor position
      if (dispatch) {
        dispatch(tr.setSelection(new GapCursorSelection(nextSelection.$from, isForward(dir) ? Side.LEFT : Side.RIGHT)).scrollIntoView());
      }

      return true;
    }

    if (dispatch) {
      dispatch(tr.setSelection(nextSelection).scrollIntoView());
    }

    return true;
  };
};
export var deleteNode = function deleteNode(dir) {
  return function (state, dispatch) {
    if (state.selection instanceof GapCursorSelection) {
      var _state$selection = state.selection,
          $from = _state$selection.$from,
          $anchor = _state$selection.$anchor;
      var tr = state.tr;

      if (isBackward(dir)) {
        if (state.selection.side === 'left') {
          tr.setSelection(new GapCursorSelection($anchor, Side.RIGHT));

          if (dispatch) {
            dispatch(tr);
          }

          return true;
        }

        tr = removeNodeBefore(state.tr);
      } else if ($from.nodeAfter) {
        tr = tr.delete($from.pos, $from.pos + $from.nodeAfter.nodeSize);
      }

      if (dispatch) {
        dispatch(tr.setSelection(Selection.near(tr.doc.resolve(tr.mapping.map(state.selection.$from.pos)))).scrollIntoView());
      }

      return true;
    }

    return false;
  };
};
export var setGapCursorAtPos = function setGapCursorAtPos(position) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Side.LEFT;
  return function (state, dispatch) {
    // @see ED-6231
    if (position > state.doc.content.size) {
      return false;
    }

    var $pos = state.doc.resolve(position);

    if (GapCursorSelection.valid($pos)) {
      if (dispatch) {
        dispatch(state.tr.setSelection(new GapCursorSelection($pos, side)));
      }

      return true;
    }

    return false;
  };
}; // This function captures clicks outside of the ProseMirror contentEditable area
// see also description of "handleClick" in gap-cursor pm-plugin

var captureCursorCoords = function captureCursorCoords(event, editorRef, posAtCoords, tr) {
  var rect = editorRef.getBoundingClientRect(); // capture clicks before the first block element

  if (event.clientY < rect.top) {
    return {
      position: 0,
      side: Side.LEFT
    };
  }

  if (rect.left > 0) {
    // calculate start position of a node that is vertically at the same level
    var _coords = posAtCoords({
      left: rect.left,
      top: event.clientY
    });

    if (_coords && _coords.inside > -1) {
      var $from = tr.doc.resolve(_coords.inside);
      var start = $from.before(1);
      var side = event.clientX < rect.left ? Side.LEFT : Side.RIGHT;
      var position;

      if (side === Side.LEFT) {
        position = start;
      } else {
        var node = tr.doc.nodeAt(start);

        if (node) {
          position = start + node.nodeSize;
        }
      }

      return {
        position: position,
        side: side
      };
    }
  }

  return null;
};

export var setSelectionTopLevelBlocks = function setSelectionTopLevelBlocks(tr, event, editorRef, posAtCoords, editorFocused) {
  var cursorCoords = captureCursorCoords(event, editorRef, posAtCoords, tr);

  if (!cursorCoords) {
    return;
  }

  var $pos = cursorCoords.position !== undefined ? tr.doc.resolve(cursorCoords.position) : null;

  if ($pos === null) {
    return;
  }

  var isGapCursorAllowed = cursorCoords.side === Side.LEFT ? isValidTargetNode($pos.nodeAfter) : isValidTargetNode($pos.nodeBefore);

  if (isGapCursorAllowed && GapCursorSelection.valid($pos)) {
    // this forces PM to re-render the decoration node if we change the side of the gap cursor, it doesn't do it by default
    if (tr.selection instanceof GapCursorSelection) {
      tr.setSelection(Selection.near($pos));
    } else {
      tr.setSelection(new GapCursorSelection($pos, cursorCoords.side));
    }
  } // try to set text selection if the editor isnt focused
  // if the editor is focused, we are most likely dragging a selection outside.
  else if (editorFocused === false) {
    var selectionTemp = Selection.findFrom($pos, cursorCoords.side === Side.LEFT ? 1 : -1, true);

    if (selectionTemp) {
      tr.setSelection(selectionTemp);
    }
  }
};
export var setCursorForTopLevelBlocks = function setCursorForTopLevelBlocks(event, editorRef, posAtCoords, editorFocused) {
  return function (state, dispatch) {
    var tr = state.tr;
    setSelectionTopLevelBlocks(tr, event, editorRef, posAtCoords, editorFocused);

    if (tr.selectionSet && dispatch) {
      dispatch(tr);
      return true;
    }

    return false;
  };
};
export var hasGapCursorPlugin = function hasGapCursorPlugin(state) {
  return Boolean(gapCursorPluginKey.get(state));
};