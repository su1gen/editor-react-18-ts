import { findParentNodeOfType } from 'prosemirror-utils';
import { insertSliceIntoRangeSelectionInsideList, insertSliceInsideOfPanelNodeSelected, insertSliceAtNodeEdge, insertSliceIntoEmptyNode } from './lists';
import { isListNode } from '../../list/utils/node';
import { isSelectionInsidePanel, isEmptyNode, isCursorSelectionAtTextStartOrEnd } from '../util';
export function insertSliceForLists({
  tr,
  slice,
  schema
}) {
  var _slice$content$firstC;

  const {
    selection,
    selection: {
      $to,
      $from
    }
  } = tr;
  const {
    $cursor
  } = selection;
  const panelNode = isSelectionInsidePanel(selection);
  const selectionIsInsideList = $from.blockRange($to, isListNode);

  if (!$cursor && selectionIsInsideList) {
    return insertSliceIntoRangeSelectionInsideList({
      tr,
      slice
    });
  } // if inside an empty panel, try and insert content inside it rather than replace it


  if (panelNode && isEmptyNode(panelNode) && $from.node() === $to.node()) {
    return insertSliceInsideOfPanelNodeSelected(panelNode)({
      tr,
      slice
    });
  }

  if (!$cursor || selectionIsInsideList) {
    return tr.replaceSelection(slice);
  }

  if (isEmptyNode(tr.doc.resolve($cursor.pos).node())) {
    return insertSliceIntoEmptyNode({
      tr,
      slice
    });
  } // When pasting a single list item into an action or decision, we skip the special "insert at node edge"
  // logic so that prosemirror pastes the list's content into the action/decision, rather than
  // pasting a whole list node directly after the action/decision item. (But we still preserve the
  // existing "insert at" node edge" behaviour if dealing with a list with more than one item, so that
  // it still inserts whole list node after the action/decision item).


  const pastingIntoActionOrDecision = Boolean(findParentNodeOfType([schema.nodes.taskList, schema.nodes.decisionList])(selection));
  const oneListItem = slice.content.childCount === 1 && isListNode(slice.content.firstChild) && ((_slice$content$firstC = slice.content.firstChild) === null || _slice$content$firstC === void 0 ? void 0 : _slice$content$firstC.childCount) === 1;

  if (!(pastingIntoActionOrDecision && oneListItem) && isCursorSelectionAtTextStartOrEnd(selection)) {
    return insertSliceAtNodeEdge({
      tr,
      slice
    });
  }

  tr.replaceSelection(slice);
}