import { NodeSelection, TextSelection, Selection, AllSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { selectedRect } from '@atlaskit/editor-tables/utils';
import { flatten, findParentNode } from 'prosemirror-utils';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
import { isSelectionAtStartOfNode, isSelectionAtEndOfNode } from '@atlaskit/editor-common/selection';
import { selectNode } from '../../utils/commands';
import { isEmptyParagraph } from '../../utils/document';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics';
import { isIgnored as isIgnoredByGapCursor } from '../selection/gap-cursor/utils/is-ignored';
import { selectionPluginKey } from './types';
export function createSelectionClickHandler(nodes, isValidTarget, options) {
  return function handleClickOn(view, pos, node, nodePos, event, direct) {
    if (options.useLongPressSelection) {
      return false;
    }

    if (direct && nodes.indexOf(node.type.name) !== -1) {
      if (event.target) {
        var _target = event.target;

        if (isValidTarget(_target)) {
          var selectionPos = options.getNodeSelectionPos ? options.getNodeSelectionPos(view.state, nodePos) : nodePos;
          selectNode(selectionPos)(view.state, view.dispatch);
          return true;
        }
      }
    }

    return false;
  };
}
export var getDecorations = function getDecorations(tr) {
  if (tr.selection instanceof NodeSelection) {
    return DecorationSet.create(tr.doc, [Decoration.node(tr.selection.from, tr.selection.to, {
      class: akEditorSelectedNodeClassName
    })]);
  }

  if (tr.selection instanceof TextSelection || tr.selection instanceof AllSelection) {
    var decorations = getNodesToDecorateFromSelection(tr.selection, tr.doc).map(function (_ref) {
      var node = _ref.node,
          pos = _ref.pos;
      return Decoration.node(pos, pos + node.nodeSize, {
        class: akEditorSelectedNodeClassName
      });
    });
    return DecorationSet.create(tr.doc, decorations);
  }

  return DecorationSet.empty;
};
export function getNodeSelectionAnalyticsPayload(selection) {
  if (selection instanceof NodeSelection) {
    return {
      action: ACTION.SELECTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.NODE,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        node: selection.node.type.name
      }
    };
  }
}
export function getAllSelectionAnalyticsPayload(selection) {
  if (selection instanceof AllSelection) {
    return {
      action: ACTION.SELECTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.ALL,
      eventType: EVENT_TYPE.TRACK
    };
  }
}
export function getCellSelectionAnalyticsPayload(state) {
  if (state.selection instanceof CellSelection) {
    var rect = selectedRect(state);
    var selectedCells = rect.map.cellsInRect(rect).length;
    var totalCells = rect.map.map.length;
    return {
      action: ACTION.SELECTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.CELL,
      eventType: EVENT_TYPE.TRACK,
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

export var getNodesToDecorateFromSelection = function getNodesToDecorateFromSelection(selection, doc) {
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
export function getRangeSelectionAnalyticsPayload(selection, doc) {
  if (selection instanceof TextSelection && selection.from !== selection.to) {
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
      action: ACTION.SELECTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.RANGE,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        from: anchor,
        to: head,
        nodes: nodes
      }
    };
  }
}
export function shouldRecalcDecorations(_ref2) {
  var oldEditorState = _ref2.oldEditorState,
      newEditorState = _ref2.newEditorState;
  var oldSelection = oldEditorState.selection;
  var newSelection = newEditorState.selection;
  var oldPluginState = selectionPluginKey.getState(oldEditorState);
  var newPluginState = selectionPluginKey.getState(newEditorState);

  if (!oldPluginState || !newPluginState) {
    return false;
  } // If selection is unchanged, no need to recalculate


  if (oldSelection.eq(newSelection)) {
    // We need this special case for NodeSelection, as Prosemirror still thinks the
    // selections are equal when the node has changed
    if (oldSelection instanceof NodeSelection && newSelection instanceof NodeSelection) {
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


  if (oldSelection instanceof TextSelection && newSelection instanceof TextSelection && oldSelection.from === oldSelection.to && newSelection.from === newSelection.to) {
    return false;
  }

  return true;
}
export var isSelectableContainerNode = function isSelectableContainerNode(node) {
  return !!(node && !node.isAtom && NodeSelection.isSelectable(node));
};
export var isSelectableChildNode = function isSelectableChildNode(node) {
  return !!(node && (node.isText || isEmptyParagraph(node) || NodeSelection.isSelectable(node)));
};
/**
 * Finds closest parent node that is a selectable block container node
 * If it finds a parent that is not selectable but supports gap cursor, will
 * return undefined
 */

export var findSelectableContainerParent = function findSelectableContainerParent(selection) {
  var foundNodeThatSupportsGapCursor = false;
  var selectableNode = findParentNode(function (node) {
    var isSelectable = isSelectableContainerNode(node);

    if (!isSelectable && !isIgnoredByGapCursor(node)) {
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

export var findSelectableContainerBefore = function findSelectableContainerBefore($pos, doc) {
  // prosemirror just returns the same pos from Selection.findFrom when
  // parent.inlineContent is true, so we move position back one here
  // to counteract that
  if ($pos.parent.inlineContent && isSelectableContainerNode($pos.parent)) {
    $pos = doc.resolve($pos.start() - 1);
  }

  var selectionBefore = Selection.findFrom($pos, -1);

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

      if (i > $pos.depth + 1 && !isIgnoredByGapCursor(node)) {
        return;
      }
    }
    /**
     * Stick to the default left selection behaviour,
     * useful for mediaSingleWithCaption
     */


    if (selectionBefore instanceof NodeSelection && NodeSelection.isSelectable(selectionBefore.node)) {
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

export var findSelectableContainerAfter = function findSelectableContainerAfter($pos, doc) {
  var selectionAfter = Selection.findFrom($pos, 1);

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

      if (i > $pos.depth + 1 && !isIgnoredByGapCursor(node)) {
        return;
      }
    }
  }
};
/**
 * Finds first child node that is a selectable block container node OR that
 * supports gap cursor
 */

export var findFirstChildNodeToSelect = function findFirstChildNodeToSelect(parent) {
  return flatten(parent).find(function (child) {
    return isSelectableChildNode(child.node) || !isIgnoredByGapCursor(child.node);
  });
};
/**
 * Finds last child node that is a selectable block container node OR that
 * supports gap cursor
 */

export var findLastChildNodeToSelect = function findLastChildNodeToSelect(parent) {
  var child;
  parent.descendants(function (node, pos) {
    if (isSelectableChildNode(node) || !isIgnoredByGapCursor(node)) {
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
export var isSelectionAtStartOfParentNode = function isSelectionAtStartOfParentNode($pos, selection) {
  return isSelectionAtStartOfNode($pos, findSelectableContainerParent(selection));
};
export var isSelectionAtEndOfParentNode = function isSelectionAtEndOfParentNode($pos, selection) {
  return isSelectionAtEndOfNode($pos, findSelectableContainerParent(selection));
};