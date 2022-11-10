"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSelectionClickHandler = createSelectionClickHandler;
exports.findSelectableContainerParent = exports.findSelectableContainerBefore = exports.findSelectableContainerAfter = exports.findLastChildNodeToSelect = exports.findFirstChildNodeToSelect = void 0;
exports.getAllSelectionAnalyticsPayload = getAllSelectionAnalyticsPayload;
exports.getCellSelectionAnalyticsPayload = getCellSelectionAnalyticsPayload;
exports.getDecorations = void 0;
exports.getNodeSelectionAnalyticsPayload = getNodeSelectionAnalyticsPayload;
exports.getNodesToDecorateFromSelection = void 0;
exports.getRangeSelectionAnalyticsPayload = getRangeSelectionAnalyticsPayload;
exports.isSelectionAtStartOfParentNode = exports.isSelectionAtEndOfParentNode = exports.isSelectableContainerNode = exports.isSelectableChildNode = void 0;
exports.shouldRecalcDecorations = shouldRecalcDecorations;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _cellSelection = require("@atlaskit/editor-tables/cell-selection");

var _utils = require("@atlaskit/editor-tables/utils");

var _prosemirrorUtils = require("prosemirror-utils");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _selection = require("@atlaskit/editor-common/selection");

var _commands = require("../../utils/commands");

var _document = require("../../utils/document");

var _analytics = require("../analytics");

var _isIgnored = require("../selection/gap-cursor/utils/is-ignored");

var _types = require("./types");

function createSelectionClickHandler(nodes, isValidTarget, options) {
  return function handleClickOn(view, pos, node, nodePos, event, direct) {
    if (options.useLongPressSelection) {
      return false;
    }

    if (direct && nodes.indexOf(node.type.name) !== -1) {
      if (event.target) {
        var _target = event.target;

        if (isValidTarget(_target)) {
          var selectionPos = options.getNodeSelectionPos ? options.getNodeSelectionPos(view.state, nodePos) : nodePos;
          (0, _commands.selectNode)(selectionPos)(view.state, view.dispatch);
          return true;
        }
      }
    }

    return false;
  };
}

var getDecorations = function getDecorations(tr) {
  if (tr.selection instanceof _prosemirrorState.NodeSelection) {
    return _prosemirrorView.DecorationSet.create(tr.doc, [_prosemirrorView.Decoration.node(tr.selection.from, tr.selection.to, {
      class: _editorSharedStyles.akEditorSelectedNodeClassName
    })]);
  }

  if (tr.selection instanceof _prosemirrorState.TextSelection || tr.selection instanceof _prosemirrorState.AllSelection) {
    var decorations = getNodesToDecorateFromSelection(tr.selection, tr.doc).map(function (_ref) {
      var node = _ref.node,
          pos = _ref.pos;
      return _prosemirrorView.Decoration.node(pos, pos + node.nodeSize, {
        class: _editorSharedStyles.akEditorSelectedNodeClassName
      });
    });
    return _prosemirrorView.DecorationSet.create(tr.doc, decorations);
  }

  return _prosemirrorView.DecorationSet.empty;
};

exports.getDecorations = getDecorations;

function getNodeSelectionAnalyticsPayload(selection) {
  if (selection instanceof _prosemirrorState.NodeSelection) {
    return {
      action: _analytics.ACTION.SELECTED,
      actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.NODE,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        node: selection.node.type.name
      }
    };
  }
}

function getAllSelectionAnalyticsPayload(selection) {
  if (selection instanceof _prosemirrorState.AllSelection) {
    return {
      action: _analytics.ACTION.SELECTED,
      actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.ALL,
      eventType: _analytics.EVENT_TYPE.TRACK
    };
  }
}

function getCellSelectionAnalyticsPayload(state) {
  if (state.selection instanceof _cellSelection.CellSelection) {
    var rect = (0, _utils.selectedRect)(state);
    var selectedCells = rect.map.cellsInRect(rect).length;
    var totalCells = rect.map.map.length;
    return {
      action: _analytics.ACTION.SELECTED,
      actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.CELL,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        selectedCells: selectedCells,
        totalCells: totalCells
      }
    };
  }
}

var topLevelBlockNodesThatHaveSelectionStyles = ['table', 'panel', 'expand', 'layoutSection', 'decisionList', 'decisionItem', 'codeBlock'];
/**
 * Use `getNodesToDecorateFromSelection` to collect and return
 * a list of nodes within the Selection that should have Selection
 * decorations applied. This allows selection styles to be added to
 * nested nodes. It will ignore text nodes as decorations are
 * applied natively and also ignore nodes that don't completely
 * sit within the given `Selection`.
 */

var getNodesToDecorateFromSelection = function getNodesToDecorateFromSelection(selection, doc) {
  var nodes = [];

  if (selection.from !== selection.to) {
    var from = selection.from,
        to = selection.to;
    doc.nodesBetween(from, to, function (node, pos) {
      var withinSelection = from <= pos && pos + node.nodeSize <= to; // The reason we need to check for these nodes is to stop
      // traversing their children if they are within a selection -
      // this is to prevent selection styles from being added to
      // the children as well as the parent node.
      // Example scenario is if an entire table has been selected
      // we should not traverse its children so we can apply the
      // selection styles to the table. But if an entire tableRow
      // has been selected (but the parent table has not) we should
      // traverse it as it could contain other nodes that need
      // selection styles. I couldn’t see a clear way to differentiate
      // without explicitly stating which nodes should be traversed
      // and which shouldn’t.

      var isTopLevelNodeThatHasSelectionStyles = topLevelBlockNodesThatHaveSelectionStyles.includes(node.type.name); // If the node is a top-level block node and completely sits within
      // the selection, we do not recurse it's children to prevent selection
      // styles being added to its child nodes. The expected behaviour
      // is that selection styles are only added to the parent.

      if (node && withinSelection && isTopLevelNodeThatHasSelectionStyles) {
        nodes.push({
          node: node,
          pos: pos
        });
        return false; // Otherwise we recurse the children and return them so we can apply
        // selection styles. Text is handled by the browser.
      } else if (node && withinSelection && !node.isText) {
        nodes.push({
          node: node,
          pos: pos
        });
      }

      return true;
    });
  }

  return nodes;
};

exports.getNodesToDecorateFromSelection = getNodesToDecorateFromSelection;

function getRangeSelectionAnalyticsPayload(selection, doc) {
  if (selection instanceof _prosemirrorState.TextSelection && selection.from !== selection.to) {
    var from = selection.from,
        to = selection.to,
        anchor = selection.anchor,
        head = selection.head;
    var nodes = [];
    doc.nodesBetween(from, to, function (node, pos) {
      // We want to send top-level nodes only, ie. the nodes that would have the selection styling
      // We allow text nodes that are not fully covered as they are a special case
      if (node.isText || pos >= from && pos + node.nodeSize <= to) {
        nodes.push(node.type.name);
        return false;
      }
    });
    return {
      action: _analytics.ACTION.SELECTED,
      actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.RANGE,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        from: anchor,
        to: head,
        nodes: nodes
      }
    };
  }
}

function shouldRecalcDecorations(_ref2) {
  var oldEditorState = _ref2.oldEditorState,
      newEditorState = _ref2.newEditorState;
  var oldSelection = oldEditorState.selection;
  var newSelection = newEditorState.selection;

  var oldPluginState = _types.selectionPluginKey.getState(oldEditorState);

  var newPluginState = _types.selectionPluginKey.getState(newEditorState);

  if (!oldPluginState || !newPluginState) {
    return false;
  } // If selection is unchanged, no need to recalculate


  if (oldSelection.eq(newSelection)) {
    // We need this special case for NodeSelection, as Prosemirror still thinks the
    // selections are equal when the node has changed
    if (oldSelection instanceof _prosemirrorState.NodeSelection && newSelection instanceof _prosemirrorState.NodeSelection) {
      var oldDecorations = oldPluginState.decorationSet.find();
      var newDecorations = newPluginState.decorationSet.find(); // There might not be old or new decorations if the node selection is for a text node
      // This wouldn't have happened intentionally, but we need to handle this case regardless

      if (oldDecorations.length > 0 && newDecorations.length > 0) {
        return !oldDecorations[0].eq(newDecorations[0]);
      }

      return !(oldDecorations.length === 0 && newDecorations.length === 0);
    }

    return false;
  } // There's no point updating decorations if going from one standard TextSelection to another


  if (oldSelection instanceof _prosemirrorState.TextSelection && newSelection instanceof _prosemirrorState.TextSelection && oldSelection.from === oldSelection.to && newSelection.from === newSelection.to) {
    return false;
  }

  return true;
}

var isSelectableContainerNode = function isSelectableContainerNode(node) {
  return !!(node && !node.isAtom && _prosemirrorState.NodeSelection.isSelectable(node));
};

exports.isSelectableContainerNode = isSelectableContainerNode;

var isSelectableChildNode = function isSelectableChildNode(node) {
  return !!(node && (node.isText || (0, _document.isEmptyParagraph)(node) || _prosemirrorState.NodeSelection.isSelectable(node)));
};
/**
 * Finds closest parent node that is a selectable block container node
 * If it finds a parent that is not selectable but supports gap cursor, will
 * return undefined
 */


exports.isSelectableChildNode = isSelectableChildNode;

var findSelectableContainerParent = function findSelectableContainerParent(selection) {
  var foundNodeThatSupportsGapCursor = false;
  var selectableNode = (0, _prosemirrorUtils.findParentNode)(function (node) {
    var isSelectable = isSelectableContainerNode(node);

    if (!isSelectable && !(0, _isIgnored.isIgnored)(node)) {
      foundNodeThatSupportsGapCursor = true;
    }

    return isSelectable;
  })(selection);

  if (!foundNodeThatSupportsGapCursor) {
    return selectableNode;
  }
};
/**
 * Finds node before that is a selectable block container node, starting
 * from $pos.depth + 1 and working in
 * If it finds a node that is not selectable but supports gap cursor, will
 * return undefined
 */


exports.findSelectableContainerParent = findSelectableContainerParent;

var findSelectableContainerBefore = function findSelectableContainerBefore($pos, doc) {
  // prosemirror just returns the same pos from Selection.findFrom when
  // parent.inlineContent is true, so we move position back one here
  // to counteract that
  if ($pos.parent.inlineContent && isSelectableContainerNode($pos.parent)) {
    $pos = doc.resolve($pos.start() - 1);
  }

  var selectionBefore = _prosemirrorState.Selection.findFrom($pos, -1);

  if (selectionBefore) {
    var $selectionBefore = doc.resolve(selectionBefore.from);

    for (var i = $pos.depth + 1; i <= $selectionBefore.depth; i++) {
      var node = $selectionBefore.node(i);

      if (isSelectableContainerNode(node)) {
        return {
          node: node,
          pos: $selectionBefore.start(i) - 1
        };
      }

      if (i > $pos.depth + 1 && !(0, _isIgnored.isIgnored)(node)) {
        return;
      }
    }
    /**
     * Stick to the default left selection behaviour,
     * useful for mediaSingleWithCaption
     */


    if (selectionBefore instanceof _prosemirrorState.NodeSelection && _prosemirrorState.NodeSelection.isSelectable(selectionBefore.node)) {
      return {
        node: selectionBefore.node,
        pos: selectionBefore.from
      };
    }
  }
};
/**
 * Finds node after that is a selectable block container node, starting
 * from $pos.depth + 1 and working in
 * If it finds a node that is not selectable but supports gap cursor, will
 * return undefined
 */


exports.findSelectableContainerBefore = findSelectableContainerBefore;

var findSelectableContainerAfter = function findSelectableContainerAfter($pos, doc) {
  var selectionAfter = _prosemirrorState.Selection.findFrom($pos, 1);

  if (selectionAfter) {
    var $selectionAfter = doc.resolve(selectionAfter.from);

    for (var i = $pos.depth + 1; i <= $selectionAfter.depth; i++) {
      var node = $selectionAfter.node(i);

      if (isSelectableContainerNode(node)) {
        return {
          node: node,
          pos: $selectionAfter.start(i) - 1
        };
      }

      if (i > $pos.depth + 1 && !(0, _isIgnored.isIgnored)(node)) {
        return;
      }
    }
  }
};
/**
 * Finds first child node that is a selectable block container node OR that
 * supports gap cursor
 */


exports.findSelectableContainerAfter = findSelectableContainerAfter;

var findFirstChildNodeToSelect = function findFirstChildNodeToSelect(parent) {
  return (0, _prosemirrorUtils.flatten)(parent).find(function (child) {
    return isSelectableChildNode(child.node) || !(0, _isIgnored.isIgnored)(child.node);
  });
};
/**
 * Finds last child node that is a selectable block container node OR that
 * supports gap cursor
 */


exports.findFirstChildNodeToSelect = findFirstChildNodeToSelect;

var findLastChildNodeToSelect = function findLastChildNodeToSelect(parent) {
  var child;
  parent.descendants(function (node, pos) {
    if (isSelectableChildNode(node) || !(0, _isIgnored.isIgnored)(node)) {
      child = {
        node: node,
        pos: pos
      };
      return false;
    }
  });

  if (child) {
    return child;
  }
};

exports.findLastChildNodeToSelect = findLastChildNodeToSelect;

var isSelectionAtStartOfParentNode = function isSelectionAtStartOfParentNode($pos, selection) {
  return (0, _selection.isSelectionAtStartOfNode)($pos, findSelectableContainerParent(selection));
};

exports.isSelectionAtStartOfParentNode = isSelectionAtStartOfParentNode;

var isSelectionAtEndOfParentNode = function isSelectionAtEndOfParentNode($pos, selection) {
  return (0, _selection.isSelectionAtEndOfNode)($pos, findSelectableContainerParent(selection));
};

exports.isSelectionAtEndOfParentNode = isSelectionAtEndOfParentNode;