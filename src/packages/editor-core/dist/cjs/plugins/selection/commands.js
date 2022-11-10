"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSelectionRelativeToNode = exports.setSelectionInsideAtNodeEnd = exports.arrowRight = exports.arrowLeft = void 0;

var _prosemirrorState = require("prosemirror-state");

var _gapCursorSelection = require("./gap-cursor-selection");

var _isIgnored = require("../selection/gap-cursor/utils/is-ignored");

var _document = require("../../utils/document");

var _actions = require("./actions");

var _pluginFactory = require("./plugin-factory");

var _utils = require("./utils");

var _types = require("./types");

var setSelectionRelativeToNode = function setSelectionRelativeToNode(selectionRelativeToNode, selection) {
  return (0, _pluginFactory.createCommand)({
    type: _actions.SelectionActionTypes.SET_RELATIVE_SELECTION,
    selectionRelativeToNode: selectionRelativeToNode
  }, function (tr) {
    if (selection) {
      return tr.setSelection(selection);
    }

    return tr;
  });
};

exports.setSelectionRelativeToNode = setSelectionRelativeToNode;

var arrowRight = function arrowRight(state, dispatch) {
  var selection = state.selection;

  if (selection instanceof _gapCursorSelection.GapCursorSelection) {
    return arrowRightFromGapCursor(selection)(state, dispatch);
  } else if (selection instanceof _prosemirrorState.NodeSelection) {
    return arrowRightFromNode(selection)(state, dispatch);
  } else if (selection instanceof _prosemirrorState.TextSelection) {
    return arrowRightFromText(selection)(state, dispatch);
  }

  return false;
};

exports.arrowRight = arrowRight;

var arrowLeft = function arrowLeft(state, dispatch) {
  var selection = state.selection;

  if (selection instanceof _gapCursorSelection.GapCursorSelection) {
    return arrowLeftFromGapCursor(selection)(state, dispatch);
  } else if (selection instanceof _prosemirrorState.NodeSelection) {
    return arrowLeftFromNode(selection)(state, dispatch);
  } else if (selection instanceof _prosemirrorState.TextSelection) {
    return arrowLeftFromText(selection)(state, dispatch);
  }

  return false;
};

exports.arrowLeft = arrowLeft;

var arrowRightFromGapCursor = function arrowRightFromGapCursor(selection) {
  return function (state, dispatch) {
    var $from = selection.$from,
        $to = selection.$to,
        side = selection.side;

    if (side === _gapCursorSelection.Side.LEFT) {
      var selectableNode = (0, _utils.findSelectableContainerAfter)($to, state.doc);

      if (selectableNode) {
        return setSelectionRelativeToNode(_types.RelativeSelectionPos.Start, _prosemirrorState.NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      }
    } else if (side === _gapCursorSelection.Side.RIGHT && (0, _utils.isSelectionAtEndOfParentNode)($from, selection)) {
      var _selectableNode = (0, _utils.findSelectableContainerParent)(selection);

      if (_selectableNode) {
        return setSelectionRelativeToNode(_types.RelativeSelectionPos.End, _prosemirrorState.NodeSelection.create(state.doc, _selectableNode.pos))(state, dispatch);
      }
    }

    return false;
  };
};

var arrowLeftFromGapCursor = function arrowLeftFromGapCursor(selection) {
  return function (state, dispatch) {
    var $from = selection.$from,
        side = selection.side;

    var _getPluginState = (0, _pluginFactory.getPluginState)(state),
        selectionRelativeToNode = _getPluginState.selectionRelativeToNode;

    if (side === _gapCursorSelection.Side.RIGHT) {
      var selectableNode = (0, _utils.findSelectableContainerBefore)($from, state.doc);

      if (selectableNode) {
        return setSelectionRelativeToNode(_types.RelativeSelectionPos.End, _prosemirrorState.NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      }
    } else if (side === _gapCursorSelection.Side.LEFT && (0, _utils.isSelectionAtStartOfParentNode)($from, selection)) {
      if (selectionRelativeToNode === _types.RelativeSelectionPos.Before) {
        var $parent = state.doc.resolve(selection.$from.before(selection.$from.depth));

        if ($parent) {
          var _selectableNode2 = (0, _utils.findSelectableContainerBefore)($parent, state.doc);

          if (_selectableNode2 && (0, _isIgnored.isIgnored)(_selectableNode2.node)) {
            // selection is inside node without gap cursor preceeded by another node without gap cursor - set node selection for previous node
            return setSelectionRelativeToNode(_types.RelativeSelectionPos.End, _prosemirrorState.NodeSelection.create(state.doc, _selectableNode2.pos))(state, dispatch);
          }
        } // we don't return this as we want to reset the relative pos, but not block other plugins
        // from responding to arrow left key


        setSelectionRelativeToNode()(state, dispatch);
      } else {
        var _selectableNode3 = (0, _utils.findSelectableContainerParent)(selection);

        if (_selectableNode3) {
          return setSelectionRelativeToNode(_types.RelativeSelectionPos.Start, _prosemirrorState.NodeSelection.create(state.doc, _selectableNode3.pos))(state, dispatch);
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

    var _getPluginState2 = (0, _pluginFactory.getPluginState)(state),
        selectionRelativeToNode = _getPluginState2.selectionRelativeToNode;

    if (node.isAtom) {
      if ((0, _utils.isSelectionAtEndOfParentNode)($to, selection)) {
        // selection is for inline node that is the last child of its parent node - set text selection after it
        return findAndSetTextSelection(_types.RelativeSelectionPos.End, state.doc.resolve(from + 1), _types.SelectionDirection.After)(state, dispatch);
      }

      return false;
    } else if (selectionRelativeToNode === _types.RelativeSelectionPos.Start) {
      // selection is for container node - set selection inside it at the start
      return setSelectionInsideAtNodeStart(_types.RelativeSelectionPos.Inside, node, from)(state, dispatch);
    } else if ((0, _isIgnored.isIgnored)(node) && (!selectionRelativeToNode || selectionRelativeToNode === _types.RelativeSelectionPos.End)) {
      var selectableNode = (0, _utils.findSelectableContainerAfter)($to, state.doc);

      if (selectableNode && (0, _isIgnored.isIgnored)(selectableNode.node)) {
        // selection is for node without gap cursor followed by another node without gap cursor - set node selection for next node
        return setSelectionRelativeToNode(_types.RelativeSelectionPos.Start, _prosemirrorState.NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
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

    var _getPluginState3 = (0, _pluginFactory.getPluginState)(state),
        selectionRelativeToNode = _getPluginState3.selectionRelativeToNode;

    if (node.isAtom) {
      if ((0, _utils.isSelectionAtStartOfParentNode)($from, selection)) {
        // selection is for inline node that is the first child of its parent node - set text selection before it
        return findAndSetTextSelection(_types.RelativeSelectionPos.Start, state.doc.resolve(from), _types.SelectionDirection.Before)(state, dispatch);
      }

      return false;
    } else if (selectionRelativeToNode === _types.RelativeSelectionPos.End) {
      // selection is for container node - set selection inside it at the end
      return setSelectionInsideAtNodeEnd(_types.RelativeSelectionPos.Inside, node, from, to)(state, dispatch);
    } else if (!selectionRelativeToNode || selectionRelativeToNode === _types.RelativeSelectionPos.Inside) {
      // selection is for container node - set selection inside it at the start
      // (this is a special case when the user selects by clicking node)
      return setSelectionInsideAtNodeStart(_types.RelativeSelectionPos.Before, node, from)(state, dispatch);
    } else if ((0, _isIgnored.isIgnored)(node) && selectionRelativeToNode === _types.RelativeSelectionPos.Start) {
      // selection is for node without gap cursor preceeded by another node without gap cursor - set node selection for previous node
      var selectableNode = (0, _utils.findSelectableContainerBefore)($from, state.doc);

      if (selectableNode && (0, _isIgnored.isIgnored)(selectableNode.node)) {
        return setSelectionRelativeToNode(_types.RelativeSelectionPos.End, _prosemirrorState.NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      }
    }

    return false;
  };
};

var arrowRightFromText = function arrowRightFromText(selection) {
  return function (state, dispatch) {
    if ((0, _utils.isSelectionAtEndOfParentNode)(selection.$to, selection)) {
      var selectableNode = (0, _utils.findSelectableContainerParent)(selection);

      if (selectableNode) {
        return setSelectionRelativeToNode(_types.RelativeSelectionPos.End, _prosemirrorState.NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      }
    }

    return false;
  };
};

var arrowLeftFromText = function arrowLeftFromText(selection) {
  return function (state, dispatch) {
    var _getPluginState4 = (0, _pluginFactory.getPluginState)(state),
        selectionRelativeToNode = _getPluginState4.selectionRelativeToNode;

    if (selectionRelativeToNode === _types.RelativeSelectionPos.Before) {
      var selectableNode = (0, _utils.findSelectableContainerBefore)(selection.$from, state.doc);

      if (selectableNode && (0, _isIgnored.isIgnored)(selectableNode.node)) {
        // selection is inside node without gap cursor preceeded by another node without gap cursor - set node selection for previous node
        return setSelectionRelativeToNode(_types.RelativeSelectionPos.End, _prosemirrorState.NodeSelection.create(state.doc, selectableNode.pos))(state, dispatch);
      } // we don't return this as we want to reset the relative pos, but not block other plugins
      // from responding to arrow left key


      setSelectionRelativeToNode(undefined)(state, dispatch);
    } else if ((0, _utils.isSelectionAtStartOfParentNode)(selection.$from, selection)) {
      var _selectableNode4 = (0, _utils.findSelectableContainerParent)(selection);

      if (_selectableNode4) {
        return setSelectionRelativeToNode(_types.RelativeSelectionPos.Start, _prosemirrorState.NodeSelection.create(state.doc, _selectableNode4.pos))(state, dispatch);
      }
    }

    return false;
  };
};

var findAndSetTextSelection = function findAndSetTextSelection(selectionRelativeToNode, $pos, dir) {
  return function (state, dispatch) {
    var sel = _prosemirrorState.Selection.findFrom($pos, dir, true);

    if (sel) {
      return setSelectionRelativeToNode(selectionRelativeToNode, sel)(state, dispatch);
    }

    return false;
  };
};

var setSelectionInsideAtNodeStart = function setSelectionInsideAtNodeStart(selectionRelativeToNode, node, pos) {
  return function (state, dispatch) {
    if ((0, _document.isNodeEmpty)(node)) {
      return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(pos), _types.SelectionDirection.After)(state, dispatch);
    }

    var selectableNode = (0, _utils.findFirstChildNodeToSelect)(node);

    if (selectableNode) {
      var childNode = selectableNode.node,
          childPos = selectableNode.pos;
      var selectionPos = pos + childPos + 1;

      if (childNode.isText || childNode.isAtom) {
        return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(selectionPos), _types.SelectionDirection.Before)(state, dispatch);
      } else if ((0, _document.isEmptyParagraph)(childNode)) {
        return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(selectionPos + 1), _types.SelectionDirection.Before)(state, dispatch);
      } else if (!(0, _isIgnored.isIgnored)(node)) {
        return setSelectionRelativeToNode(selectionRelativeToNode, new _gapCursorSelection.GapCursorSelection(state.doc.resolve(selectionPos), _gapCursorSelection.Side.LEFT))(state, dispatch);
      } else if ((0, _utils.isSelectableContainerNode)(node)) {
        return setSelectionRelativeToNode(selectionRelativeToNode, _prosemirrorState.NodeSelection.create(state.doc, selectionPos))(state, dispatch);
      }
    }

    return false;
  };
};

var setSelectionInsideAtNodeEnd = function setSelectionInsideAtNodeEnd(selectionRelativeToNode, node, from, to) {
  return function (state, dispatch) {
    if ((0, _document.isNodeEmpty)(node)) {
      return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(to), _types.SelectionDirection.Before)(state, dispatch);
    }

    var selectableNode = (0, _utils.findLastChildNodeToSelect)(node);

    if (selectableNode) {
      var childNode = selectableNode.node,
          childPos = selectableNode.pos;
      var selectionPos = from + childPos + childNode.nodeSize;

      if (childNode.isText || childNode.isAtom) {
        return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(selectionPos + 1), _types.SelectionDirection.After)(state, dispatch);
      } else if ((0, _document.isEmptyParagraph)(childNode)) {
        return findAndSetTextSelection(selectionRelativeToNode, state.doc.resolve(selectionPos), _types.SelectionDirection.After)(state, dispatch);
      } else if (!(0, _isIgnored.isIgnored)(node)) {
        return setSelectionRelativeToNode(selectionRelativeToNode, new _gapCursorSelection.GapCursorSelection(state.doc.resolve(selectionPos + 1), _gapCursorSelection.Side.RIGHT))(state, dispatch);
      } else if ((0, _utils.isSelectableContainerNode)(node)) {
        return setSelectionRelativeToNode(selectionRelativeToNode, _prosemirrorState.NodeSelection.create(state.doc, selectionPos))(state, dispatch);
      }
    }

    return false;
  };
};

exports.setSelectionInsideAtNodeEnd = setSelectionInsideAtNodeEnd;