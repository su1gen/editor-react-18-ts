import { NodeSelection, TextSelection, Selection } from 'prosemirror-state';
import { GapCursorSelection, Side } from './gap-cursor-selection';
import { isIgnored as isIgnoredByGapCursor } from '../selection/gap-cursor/utils/is-ignored';
import { isNodeEmpty, isEmptyParagraph } from '../../utils/document';
import { SelectionActionTypes } from './actions';
import { createCommand, getPluginState } from './plugin-factory';
import { isSelectableContainerNode, isSelectionAtEndOfParentNode, findSelectableContainerParent, isSelectionAtStartOfParentNode, findSelectableContainerBefore, findSelectableContainerAfter, findFirstChildNodeToSelect, findLastChildNodeToSelect } from './utils';
import { RelativeSelectionPos, SelectionDirection } from './types';
export var setSelectionRelativeToNode = function setSelectionRelativeToNode(selectionRelativeToNode, selection) {
  return createCommand({
    type: SelectionActionTypes.SET_RELATIVE_SELECTION,
    selectionRelativeToNode: selectionRelativeToNode
  }, function (tr) {
    if (selection) {
      return tr.setSelection(selection);
    }

    return tr;
  });
};
export var arrowRight = function arrowRight(state, dispatch) {
  var selection = state.selection;

  if (selection instanceof GapCursorSelection) {
    return arrowRightFromGapCursor(selection)(state, dispatch);
  } else if (selection instanceof NodeSelection) {
    return arrowRightFromNode(selection)(state, dispatch);
  } else if (selection instanceof TextSelection) {
    return arrowRightFromText(selection)(state, dispatch);
  }

  return false;
};
export var arrowLeft = function arrowLeft(state, dispatch) {
  var selection = state.selection;

  if (selection instanceof GapCursorSelection) {
    return arrowLeftFromGapCursor(selection)(state, dispatch);
  } else if (selection instanceof NodeSelection) {
    return arrowLeftFromNode(selection)(state, dispatch);
  } else if (selection instanceof TextSelection) {
    return arrowLeftFromText(selection)(state, dispatch);
  }

  return false;
};

var arrowRightFromGapCursor = function arrowRightFromGapCursor(selection) {
  return function (state, dispatch) {
    var $from = selection.$from,
        $to = selection.$to,
        side = selection.side;

    if (side === Side.LEFT) {
      var selectableNode = findSelectableContainerAfter($to, state.doc);

      if (selectableNode) {
        return setSelectionRelativeToNode(RelativeSelectionPos.Start, NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      }
    } else if (side === Side.RIGHT && isSelectionAtEndOfParentNode($from, selection)) {
      var _selectableNode = findSelectableContainerParent(selection);

      if (_selectableNode) {
        return setSelectionRelativeToNode(RelativeSelectionPos.End, NodeSelection.create(state.doc, _selectableNode.pos))(state, dispatch);
      }
    }

    return false;
  };
};

var arrowLeftFromGapCursor = function arrowLeftFromGapCursor(selection) {
  return function (state, dispatch) {
    var $from = selection.$from,
        side = selection.side;

    var _getPluginState = getPluginState(state),
        selectionRelativeToNode = _getPluginState.selectionRelativeToNode;

    if (side === Side.RIGHT) {
      var selectableNode = findSelectableContainerBefore($from, state.doc);

      if (selectableNode) {
        return setSelectionRelativeToNode(RelativeSelectionPos.End, NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      }
    } else if (side === Side.LEFT && isSelectionAtStartOfParentNode($from, selection)) {
      if (selectionRelativeToNode === RelativeSelectionPos.Before) {
        var $parent = state.doc.resolve(selection.$from.before(selection.$from.depth));

        if ($parent) {
          var _selectableNode2 = findSelectableContainerBefore($parent, state.doc);

          if (_selectableNode2 && isIgnoredByGapCursor(_selectableNode2.node)) {
            // selection is inside node without gap cursor preceeded by another node without gap cursor - set node selection for previous node
            return setSelectionRelativeToNode(RelativeSelectionPos.End, NodeSelection.create(state.doc, _selectableNode2.pos))(state, dispatch);
          }
        } // we don't return this as we want to reset the relative pos, but not block other plugins
        // from responding to arrow left key


        setSelectionRelativeToNode()(state, dispatch);
      } else {
        var _selectableNode3 = findSelectableContainerParent(selection);

        if (_selectableNode3) {
          return setSelectionRelativeToNode(RelativeSelectionPos.Start, NodeSelection.create(state.doc, _selectableNode3.pos))(state, dispatch);
        }
      }
    }

    return false;
  };
};

var arrowRightFromNode = function arrowRightFromNode(selection) {
  return function (state, dispatch) {
    var node = selection.node,
        from = selection.from,
        $to = selection.$to;

    var _getPluginState2 = getPluginState(state),
        selectionRelativeToNode = _getPluginState2.selectionRelativeToNode;

    if (node.isAtom) {
      if (isSelectionAtEndOfParentNode($to, selection)) {
        // selection is for inline node that is the last child of its parent node - set text selection after it
        return findAndSetTextSelection(RelativeSelectionPos.End, state.doc.resolve(from + 1), SelectionDirection.After)(state, dispatch);
      }

      return false;
    } else if (selectionRelativeToNode === RelativeSelectionPos.Start) {
      // selection is for container node - set selection inside it at the start
      return setSelectionInsideAtNodeStart(RelativeSelectionPos.Inside, node, from)(state, dispatch);
    } else if (isIgnoredByGapCursor(node) && (!selectionRelativeToNode || selectionRelativeToNode === RelativeSelectionPos.End)) {
      var selectableNode = findSelectableContainerAfter($to, state.doc);

      if (selectableNode && isIgnoredByGapCursor(selectableNode.node)) {
        // selection is for node without gap cursor followed by another node without gap cursor - set node selection for next node
        return setSelectionRelativeToNode(RelativeSelectionPos.Start, NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      }
    }

    return false;
  };
};

var arrowLeftFromNode = function arrowLeftFromNode(selection) {
  return function (state, dispatch) {
    var node = selection.node,
        from = selection.from,
        to = selection.to,
        $from = selection.$from;

    var _getPluginState3 = getPluginState(state),
        selectionRelativeToNode = _getPluginState3.selectionRelativeToNode;

    if (node.isAtom) {
      if (isSelectionAtStartOfParentNode($from, selection)) {
        // selection is for inline node that is the first child of its parent node - set text selection before it
        return findAndSetTextSelection(RelativeSelectionPos.Start, state.doc.resolve(from), SelectionDirection.Before)(state, dispatch);
      }

      return false;
    } else if (selectionRelativeToNode === RelativeSelectionPos.End) {
      // selection is for container node - set selection inside it at the end
      return setSelectionInsideAtNodeEnd(RelativeSelectionPos.Inside, node, from, to)(state, dispatch);
    } else if (!selectionRelativeToNode || selectionRelativeToNode === RelativeSelectionPos.Inside) {
      // selection is for container node - set selection inside it at the start
      // (this is a special case when the user selects by clicking node)
      return setSelectionInsideAtNodeStart(RelativeSelectionPos.Before, node, from)(state, dispatch);
    } else if (isIgnoredByGapCursor(node) && selectionRelativeToNode === RelativeSelectionPos.Start) {
      // selection is for node without gap cursor preceeded by another node without gap cursor - set node selection for previous node
      var selectableNode = findSelectableContainerBefore($from, state.doc);

      if (selectableNode && isIgnoredByGapCursor(selectableNode.node)) {
        return setSelectionRelativeToNode(RelativeSelectionPos.End, NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      }
    }

    return false;
  };
};

var arrowRightFromText = function arrowRightFromText(selection) {
  return function (state, dispatch) {
    if (isSelectionAtEndOfParentNode(selection.$to, selection)) {
      var selectableNode = findSelectableContainerParent(selection);

      if (selectableNode) {
        return setSelectionRelativeToNode(RelativeSelectionPos.End, NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      }
    }

    return false;
  };
};

var arrowLeftFromText = function arrowLeftFromText(selection) {
  return function (state, dispatch) {
    var _getPluginState4 = getPluginState(state),
        selectionRelativeToNode = _getPluginState4.selectionRelativeToNode;

    if (selectionRelativeToNode === RelativeSelectionPos.Before) {
      var selectableNode = findSelectableContainerBefore(selection.$from, state.doc);

      if (selectableNode && isIgnoredByGapCursor(selectableNode.node)) {
        // selection is inside node without gap cursor preceeded by another node without gap cursor - set node selection for previous node
        return setSelectionRelativeToNode(RelativeSelectionPos.End, NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      } // we don't return this as we want to reset the relative pos, but not block other plugins
      // from responding to arrow left key


      setSelectionRelativeToNode(undefined)(state, dispatch);
    } else if (isSelectionAtStartOfParentNode(selection.$from, selection)) {
      var _selectableNode4 = findSelectableContainerParent(selection);

      if (_selectableNode4) {
        return setSelectionRelativeToNode(RelativeSelectionPos.Start, NodeSelection.create(state.doc, _selectableNode4.pos))(state, dispatch);
      }
    }

    return false;
  };
};

var findAndSetTextSelection = function findAndSetTextSelection(selectionRelativeToNode, $pos, dir) {
  return function (state, dispatch) {
    var sel = Selection.findFrom($pos, dir, true);

    if (sel) {
      return setSelectionRelativeToNode(selectionRelativeToNode, sel)(state, dispatch);
    }

    return false;
  };
};

var setSelectionInsideAtNodeStart = function setSelectionInsideAtNodeStart(selectionRelativeToNode, node, pos) {
  return function (state, dispatch) {
    if (isNodeEmpty(node)) {
      return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(pos), SelectionDirection.After)(state, dispatch);
    }

    var selectableNode = findFirstChildNodeToSelect(node);

    if (selectableNode) {
      var childNode = selectableNode.node,
          childPos = selectableNode.pos;
      var selectionPos = pos + childPos + 1;

      if (childNode.isText || childNode.isAtom) {
        return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(selectionPos), SelectionDirection.Before)(state, dispatch);
      } else if (isEmptyParagraph(childNode)) {
        return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(selectionPos + 1), SelectionDirection.Before)(state, dispatch);
      } else if (!isIgnoredByGapCursor(node)) {
        return setSelectionRelativeToNode(selectionRelativeToNode, new GapCursorSelection(state.doc.resolve(selectionPos), Side.LEFT))(state, dispatch);
      } else if (isSelectableContainerNode(node)) {
        return setSelectionRelativeToNode(selectionRelativeToNode, NodeSelection.create(state.doc, selectionPos))(state, dispatch);
      }
    }

    return false;
  };
};

export var setSelectionInsideAtNodeEnd = function setSelectionInsideAtNodeEnd(selectionRelativeToNode, node, from, to) {
  return function (state, dispatch) {
    if (isNodeEmpty(node)) {
      return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(to), SelectionDirection.Before)(state, dispatch);
    }

    var selectableNode = findLastChildNodeToSelect(node);

    if (selectableNode) {
      var childNode = selectableNode.node,
          childPos = selectableNode.pos;
      var selectionPos = from + childPos + childNode.nodeSize;

      if (childNode.isText || childNode.isAtom) {
        return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(selectionPos + 1), SelectionDirection.After)(state, dispatch);
      } else if (isEmptyParagraph(childNode)) {
        return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(selectionPos), SelectionDirection.After)(state, dispatch);
      } else if (!isIgnoredByGapCursor(node)) {
        return setSelectionRelativeToNode(selectionRelativeToNode, new GapCursorSelection(state.doc.resolve(selectionPos + 1), Side.RIGHT))(state, dispatch);
      } else if (isSelectableContainerNode(node)) {
        return setSelectionRelativeToNode(selectionRelativeToNode, NodeSelection.create(state.doc, selectionPos))(state, dispatch);
      }
    }

    return false;
  };
};