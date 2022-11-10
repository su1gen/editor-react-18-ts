"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSelectionTopLevelBlocks = exports.setGapCursorAtPos = exports.setCursorForTopLevelBlocks = exports.hasGapCursorPlugin = exports.deleteNode = exports.arrow = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("@atlaskit/editor-common/utils");

var _direction = require("./direction");

var _selection = require("./selection");

var _utils2 = require("./utils");

var _isValidTargetNode = require("./utils/is-valid-target-node");

var _position = require("../../../utils/prosemirror/position");

var _gapCursorPluginKey = require("../pm-plugins/gap-cursor-plugin-key");

var _mapDirection;

var mapDirection = (_mapDirection = {}, (0, _defineProperty2.default)(_mapDirection, _direction.Direction.LEFT, -1), (0, _defineProperty2.default)(_mapDirection, _direction.Direction.RIGHT, 1), (0, _defineProperty2.default)(_mapDirection, _direction.Direction.UP, -1), (0, _defineProperty2.default)(_mapDirection, _direction.Direction.DOWN, 1), (0, _defineProperty2.default)(_mapDirection, _direction.Direction.BACKWARD, -1), (0, _defineProperty2.default)(_mapDirection, _direction.Direction.FORWARD, 1), _mapDirection);

function shouldHandleMediaGapCursor(dir, state) {
  var doc = state.doc,
      schema = state.schema,
      selection = state.selection;
  var $pos = (0, _direction.isBackward)(dir) ? selection.$from : selection.$to;

  if (selection instanceof _prosemirrorState.TextSelection) {
    // Should not use gap cursor if I am moving from a text selection into a media node
    if (dir === _direction.Direction.UP && !(0, _position.atTheBeginningOfDoc)(state) || dir === _direction.Direction.DOWN && !(0, _position.atTheEndOfDoc)(state)) {
      var media = (0, _utils2.getMediaNearPos)(doc, $pos, schema, mapDirection[dir]);

      if (media) {
        return false;
      }
    } // Should not use gap cursor if I am moving from a text selection into a media node with layout wrap-right or wrap-left


    if (dir === _direction.Direction.LEFT || dir === _direction.Direction.RIGHT) {
      var _media = (0, _utils2.getMediaNearPos)(doc, $pos, schema, mapDirection[dir]);

      var mediaSingle = schema.nodes.mediaSingle;

      if (_media && _media.type === mediaSingle && (_media.attrs.layout === 'wrap-right' || _media.attrs.layout === 'wrap-left')) {
        return false;
      }
    }
  }

  if (selection instanceof _prosemirrorState.NodeSelection) {
    // Should not use gap cursor if I am moving left/right from media node with layout wrap right or wrap-left
    if (dir === _direction.Direction.LEFT || dir === _direction.Direction.RIGHT) {
      var maybeMedia = doc.nodeAt(selection.$from.pos);
      var _mediaSingle = schema.nodes.mediaSingle;

      if (maybeMedia && maybeMedia.type === _mediaSingle && (maybeMedia.attrs.layout === 'wrap-right' || maybeMedia.attrs.layout === 'wrap-left')) {
        return false;
      }
    }
  }

  return true;
}

var arrow = function arrow(dir, endOfTextblock) {
  return function (state, dispatch, view) {
    var doc = state.doc,
        schema = state.schema,
        selection = state.selection,
        tr = state.tr;
    var $pos = (0, _direction.isBackward)(dir) ? selection.$from : selection.$to;
    var mustMove = selection.empty; // start from text selection

    if (selection instanceof _prosemirrorState.TextSelection) {
      // if cursor is in the middle of a text node, do nothing
      if (!endOfTextblock || !endOfTextblock(dir.toString())) {
        return false;
      } // UP/DOWN jumps to the nearest texblock skipping gapcursor whenever possible


      if (dir === _direction.Direction.UP && !(0, _position.atTheBeginningOfDoc)(state) && (0, _utils2.isTextBlockNearPos)(doc, schema, $pos, -1) || dir === _direction.Direction.DOWN && ((0, _position.atTheEndOfDoc)(state) || (0, _utils2.isTextBlockNearPos)(doc, schema, $pos, 1))) {
        return false;
      } // otherwise resolve previous/next position


      $pos = doc.resolve((0, _direction.isBackward)(dir) ? $pos.before() : $pos.after());
      mustMove = false;
    }

    if (selection instanceof _prosemirrorState.NodeSelection) {
      if (selection.node.isInline) {
        return false;
      }

      if (dir === _direction.Direction.UP || dir === _direction.Direction.DOWN) {
        // We dont add gap cursor on node selections going up and down
        return false;
      }
    }

    if (!shouldHandleMediaGapCursor(dir, state)) {
      return false;
    } // when jumping between block nodes at the same depth, we need to reverse cursor without changing ProseMirror position


    if (selection instanceof _selection.GapCursorSelection && // next node allow gap cursor position
    (0, _isValidTargetNode.isValidTargetNode)((0, _direction.isBackward)(dir) ? $pos.nodeBefore : $pos.nodeAfter) && ( // gap cursor changes block node
    (0, _direction.isBackward)(dir) && selection.side === _selection.Side.LEFT || (0, _direction.isForward)(dir) && selection.side === _selection.Side.RIGHT)) {
      // reverse cursor position
      if (dispatch) {
        dispatch(tr.setSelection(new _selection.GapCursorSelection($pos, selection.side === _selection.Side.RIGHT ? _selection.Side.LEFT : _selection.Side.RIGHT)).scrollIntoView());
      }

      return true;
    }

    if (view) {
      var domAtPos = view.domAtPos.bind(view);
      var target = (0, _prosemirrorUtils.findDomRefAtPos)($pos.pos, domAtPos);

      if (target && target.textContent === _utils.ZERO_WIDTH_SPACE) {
        return false;
      }
    }

    var nextSelection = _selection.GapCursorSelection.findFrom($pos, (0, _direction.isBackward)(dir) ? -1 : 1, mustMove);

    if (!nextSelection) {
      return false;
    }

    if (!(0, _isValidTargetNode.isValidTargetNode)((0, _direction.isForward)(dir) ? nextSelection.$from.nodeBefore : nextSelection.$from.nodeAfter)) {
      // reverse cursor position
      if (dispatch) {
        dispatch(tr.setSelection(new _selection.GapCursorSelection(nextSelection.$from, (0, _direction.isForward)(dir) ? _selection.Side.LEFT : _selection.Side.RIGHT)).scrollIntoView());
      }

      return true;
    }

    if (dispatch) {
      dispatch(tr.setSelection(nextSelection).scrollIntoView());
    }

    return true;
  };
};

exports.arrow = arrow;

var deleteNode = function deleteNode(dir) {
  return function (state, dispatch) {
    if (state.selection instanceof _selection.GapCursorSelection) {
      var _state$selection = state.selection,
          $from = _state$selection.$from,
          $anchor = _state$selection.$anchor;
      var tr = state.tr;

      if ((0, _direction.isBackward)(dir)) {
        if (state.selection.side === 'left') {
          tr.setSelection(new _selection.GapCursorSelection($anchor, _selection.Side.RIGHT));

          if (dispatch) {
            dispatch(tr);
          }

          return true;
        }

        tr = (0, _prosemirrorUtils.removeNodeBefore)(state.tr);
      } else if ($from.nodeAfter) {
        tr = tr.delete($from.pos, $from.pos + $from.nodeAfter.nodeSize);
      }

      if (dispatch) {
        dispatch(tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(tr.mapping.map(state.selection.$from.pos)))).scrollIntoView());
      }

      return true;
    }

    return false;
  };
};

exports.deleteNode = deleteNode;

var setGapCursorAtPos = function setGapCursorAtPos(position) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _selection.Side.LEFT;
  return function (state, dispatch) {
    // @see ED-6231
    if (position > state.doc.content.size) {
      return false;
    }

    var $pos = state.doc.resolve(position);

    if (_selection.GapCursorSelection.valid($pos)) {
      if (dispatch) {
        dispatch(state.tr.setSelection(new _selection.GapCursorSelection($pos, side)));
      }

      return true;
    }

    return false;
  };
}; // This function captures clicks outside of the ProseMirror contentEditable area
// see also description of "handleClick" in gap-cursor pm-plugin


exports.setGapCursorAtPos = setGapCursorAtPos;

var captureCursorCoords = function captureCursorCoords(event, editorRef, posAtCoords, tr) {
  var rect = editorRef.getBoundingClientRect(); // capture clicks before the first block element

  if (event.clientY < rect.top) {
    return {
      position: 0,
      side: _selection.Side.LEFT
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
      var side = event.clientX < rect.left ? _selection.Side.LEFT : _selection.Side.RIGHT;
      var position;

      if (side === _selection.Side.LEFT) {
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

var setSelectionTopLevelBlocks = function setSelectionTopLevelBlocks(tr, event, editorRef, posAtCoords, editorFocused) {
  var cursorCoords = captureCursorCoords(event, editorRef, posAtCoords, tr);

  if (!cursorCoords) {
    return;
  }

  var $pos = cursorCoords.position !== undefined ? tr.doc.resolve(cursorCoords.position) : null;

  if ($pos === null) {
    return;
  }

  var isGapCursorAllowed = cursorCoords.side === _selection.Side.LEFT ? (0, _isValidTargetNode.isValidTargetNode)($pos.nodeAfter) : (0, _isValidTargetNode.isValidTargetNode)($pos.nodeBefore);

  if (isGapCursorAllowed && _selection.GapCursorSelection.valid($pos)) {
    // this forces PM to re-render the decoration node if we change the side of the gap cursor, it doesn't do it by default
    if (tr.selection instanceof _selection.GapCursorSelection) {
      tr.setSelection(_prosemirrorState.Selection.near($pos));
    } else {
      tr.setSelection(new _selection.GapCursorSelection($pos, cursorCoords.side));
    }
  } // try to set text selection if the editor isnt focused
  // if the editor is focused, we are most likely dragging a selection outside.
  else if (editorFocused === false) {
    var selectionTemp = _prosemirrorState.Selection.findFrom($pos, cursorCoords.side === _selection.Side.LEFT ? 1 : -1, true);

    if (selectionTemp) {
      tr.setSelection(selectionTemp);
    }
  }
};

exports.setSelectionTopLevelBlocks = setSelectionTopLevelBlocks;

var setCursorForTopLevelBlocks = function setCursorForTopLevelBlocks(event, editorRef, posAtCoords, editorFocused) {
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

exports.setCursorForTopLevelBlocks = setCursorForTopLevelBlocks;

var hasGapCursorPlugin = function hasGapCursorPlugin(state) {
  return Boolean(_gapCursorPluginKey.gapCursorPluginKey.get(state));
};

exports.hasGapCursorPlugin = hasGapCursorPlugin;