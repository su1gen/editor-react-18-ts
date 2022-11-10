import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { TextSelection, NodeSelection } from 'prosemirror-state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { transformSmartCharsMentionsAndEmojis } from '../plugins/text-formatting/commands/transform-to-code';
import { GapCursorSelection } from '../plugins/selection/gap-cursor-selection';
import { isEmptyParagraph } from './document';

var filter = function filter(predicates, cmd) {
  return function (state, dispatch, view) {
    if (!Array.isArray(predicates)) {
      predicates = [predicates];
    }

    if (predicates.some(function (pred) {
      return !pred(state, view);
    })) {
      return false;
    }

    return cmd(state, dispatch, view) || false;
  };
};

var isEmptySelectionAtStart = function isEmptySelectionAtStart(state) {
  var _state$selection = state.selection,
      empty = _state$selection.empty,
      $from = _state$selection.$from;
  return empty && ($from.parentOffset === 0 || state.selection instanceof GapCursorSelection);
};

var isEmptySelectionAtEnd = function isEmptySelectionAtEnd(state) {
  var _state$selection2 = state.selection,
      empty = _state$selection2.empty,
      $from = _state$selection2.$from;
  return empty && ($from.end() === $from.pos || state.selection instanceof GapCursorSelection);
};

var isFirstChildOfParent = function isFirstChildOfParent(state) {
  var $from = state.selection.$from;
  return $from.depth > 1 ? state.selection instanceof GapCursorSelection && $from.parentOffset === 0 || $from.index($from.depth - 1) === 0 : true;
};
/**
 * Creates a filter that checks if the node at a given number of parents above the current
 * selection is of the correct node type.
 * @param nodeType The node type to compare the nth parent against
 * @param depthAway How many levels above the current node to check against. 0 refers to
 * the current selection's parent, which will be the containing node when the selection
 * is usually inside the text content.
 */


var isNthParentOfType = function isNthParentOfType(nodeType, depthAway) {
  return function (state) {
    var $from = state.selection.$from;
    var parent = $from.node($from.depth - depthAway);
    return !!parent && parent.type === state.schema.nodes[nodeType];
  };
}; // https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L90
// Keep going left up the tree, without going across isolating boundaries, until we
// can go along the tree at that same level
//
// You can think of this as, if you could construct each document like we do in the tests,
// return the position of the first ) backwards from the current selection.


function findCutBefore($pos) {
  // parent is non-isolating, so we can look across this boundary
  if (!$pos.parent.type.spec.isolating) {
    // search up the tree from the pos's *parent*
    for (var i = $pos.depth - 1; i >= 0; i--) {
      // starting from the inner most node's parent, find out
      // if we're not its first child
      if ($pos.index(i) > 0) {
        return $pos.doc.resolve($pos.before(i + 1));
      }

      if ($pos.node(i).type.spec.isolating) {
        break;
      }
    }
  }

  return null;
}

var applyMarkOnRange = function applyMarkOnRange(from, to, removeMark, mark, tr) {
  var schema = tr.doc.type.schema;
  var code = schema.marks.code;

  if (mark.type === code) {
    transformSmartCharsMentionsAndEmojis(from, to, tr);
  }

  tr.doc.nodesBetween(tr.mapping.map(from), tr.mapping.map(to), function (node, pos) {
    if (!node.isText) {
      return true;
    } // This is an issue when the user selects some text.
    // We need to check if the current node position is less than the range selection from.
    // If it’s true, that means we should apply the mark using the range selection,
    // not the current node position.


    var nodeBetweenFrom = Math.max(pos, tr.mapping.map(from));
    var nodeBetweenTo = Math.min(pos + node.nodeSize, tr.mapping.map(to));

    if (removeMark) {
      tr.removeMark(nodeBetweenFrom, nodeBetweenTo, mark);
    } else {
      tr.addMark(nodeBetweenFrom, nodeBetweenTo, mark);
    }

    return true;
  });
  return tr;
};

var toggleMarkInRange = function toggleMarkInRange(mark) {
  return function (state, dispatch) {
    var tr = state.tr;

    if (state.selection instanceof CellSelection) {
      var markInRange = false;
      var cells = [];
      state.selection.forEachCell(function (cell, cellPos) {
        cells.push({
          node: cell,
          pos: cellPos
        });
        var from = cellPos;
        var to = cellPos + cell.nodeSize;

        if (!markInRange) {
          markInRange = state.doc.rangeHasMark(from, to, mark);
        }
      });

      for (var i = cells.length - 1; i >= 0; i--) {
        var cell = cells[i];
        var from = cell.pos;
        var to = from + cell.node.nodeSize;
        applyMarkOnRange(from, to, markInRange, mark, tr);
      }
    } else {
      var _state$selection3 = state.selection,
          $from = _state$selection3.$from,
          $to = _state$selection3.$to; // The type for `rangeHasMark` only accepts a `MarkType` as a third param,
      // Yet the internals use a method that exists on both MarkType and Mark (one checks attributes the other doesnt)
      // For example, with our subsup mark: We use the same mark with different attributes to convert
      // different formatting but when using `MarkType.isInSet(marks)` it returns true for both.
      // Calling `Mark.isInSet(marks)` compares attributes as well.

      var _markInRange = state.doc.rangeHasMark($from.pos, $to.pos, mark);

      applyMarkOnRange($from.pos, $to.pos, _markInRange, mark, tr);
    }

    if (tr.docChanged) {
      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};
/**
 * A wrapper over the default toggleMark, except when we have a selection
 * we only toggle marks on text nodes rather than inline nodes.
 * @param markType
 * @param attrs
 */


var toggleMark = function toggleMark(markType, attrs) {
  return function (state, dispatch) {
    var mark = markType.create(attrs); // For cursor selections we can use the default behaviour.

    if (state.selection instanceof TextSelection && state.selection.$cursor) {
      var tr = state.tr;

      if (mark.isInSet(state.storedMarks || state.selection.$cursor.marks())) {
        tr.removeStoredMark(mark);
      } else {
        tr.addStoredMark(mark);
      }

      if (dispatch) {
        dispatch(tr);
        return true;
      }

      return false;
    }

    return toggleMarkInRange(mark)(state, dispatch);
  };
};

var withScrollIntoView = function withScrollIntoView(command) {
  return function (state, dispatch, view) {
    return command(state, function (tr) {
      tr.scrollIntoView();

      if (dispatch) {
        dispatch(tr);
      }
    }, view);
  };
};

/**
 * Walk forwards from a position until we encounter the (inside) start of
 * the next node, or reach the end of the document.
 *
 * @param $startPos Position to start walking from.
 */
var walkNextNode = function walkNextNode($startPos) {
  var $pos = $startPos; // invariant 1: don't walk past the end of the document
  // invariant 2: we are at the beginning or
  //              we haven't walked to the start of *any* node
  //              parentOffset includes textOffset.

  while ($pos.pos < $pos.doc.nodeSize - 2 && ($pos.pos === $startPos.pos || $pos.parentOffset > 0)) {
    $pos = $pos.doc.resolve($pos.pos + 1);
  }

  return {
    $pos: $pos,
    foundNode: $pos.pos < $pos.doc.nodeSize - 2
  };
};
/**
 * Walk backwards from a position until we encounter the (inside) end of
 * the previous node, or reach the start of the document.
 *
 * @param $startPos Position to start walking from.
 */


var walkPrevNode = function walkPrevNode($startPos) {
  var $pos = $startPos;

  while ($pos.pos > 0 && ($pos.pos === $startPos.pos || $pos.parentOffset < $pos.parent.nodeSize - 2)) {
    $pos = $pos.doc.resolve($pos.pos - 1);
  }

  return {
    $pos: $pos,
    foundNode: $pos.pos > 0
  };
};
/**
 * Insert content, delete a range and create a new selection
 * This function automatically handles the mapping of positions for insertion and deletion.
 * The new selection is handled as a function since it may not always be necessary to resolve a position to the transactions mapping
 *
 * @param getSelectionResolvedPos get the resolved position to create a new selection
 * @param insertions content to insert at the specified position
 * @param deletions the ranges to delete
 */


var insertContentDeleteRange = function insertContentDeleteRange(tr, getSelectionResolvedPos, insertions, deletions) {
  insertions.forEach(function (contentInsert) {
    var _contentInsert = _slicedToArray(contentInsert, 2),
        content = _contentInsert[0],
        pos = _contentInsert[1];

    tr.insert(tr.mapping.map(pos), content);
  });
  deletions.forEach(function (deleteRange) {
    var _deleteRange = _slicedToArray(deleteRange, 2),
        firstPos = _deleteRange[0],
        lastPos = _deleteRange[1];

    tr.delete(tr.mapping.map(firstPos), tr.mapping.map(lastPos));
  });
  tr.setSelection(new TextSelection(getSelectionResolvedPos(tr)));
};

var selectNode = function selectNode(pos) {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setSelection(new NodeSelection(state.doc.resolve(pos))));
    }

    return true;
  };
};
/**
 * If the selection is empty, is inside a paragraph node and `canNextNodeMoveUp` is true then delete current paragraph
 * and move the node below it up. The selection will be retained, to be placed in the moved node.
 *
 * @param canNextNodeMoveUp check if node directly after the selection is able to be brought up to selection
 * @returns PM Command
 */


var deleteEmptyParagraphAndMoveBlockUp = function deleteEmptyParagraphAndMoveBlockUp(canNextNodeMoveUp) {
  return function (state, dispatch, view) {
    var _state$selection4 = state.selection,
        _state$selection4$$fr = _state$selection4.$from,
        pos = _state$selection4$$fr.pos,
        parent = _state$selection4$$fr.parent,
        $head = _state$selection4.$head,
        empty = _state$selection4.empty,
        tr = state.tr,
        doc = state.doc;

    var _walkNextNode = walkNextNode($head),
        $pos = _walkNextNode.$pos;

    var nextPMNode = doc.nodeAt($pos.pos - 1);

    if (empty && nextPMNode && canNextNodeMoveUp(nextPMNode) && isEmptyParagraph(parent) && view !== null && view !== void 0 && view.endOfTextblock('right')) {
      tr.deleteRange(pos - 1, pos + 1);

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};

export { filter, isEmptySelectionAtStart, isEmptySelectionAtEnd, isFirstChildOfParent, isNthParentOfType, findCutBefore, toggleMark, applyMarkOnRange, withScrollIntoView, walkNextNode, walkPrevNode, insertContentDeleteRange, selectNode, deleteEmptyParagraphAndMoveBlockUp };