import { Fragment, Slice } from 'prosemirror-model';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import * as baseCommand from 'prosemirror-commands';
import { hasParentNodeOfType, findPositionOfNodeBefore } from 'prosemirror-utils';
import { hasVisibleContent } from '../../../utils/document';
import { findCutBefore, isEmptySelectionAtStart, isFirstChildOfParent, filter } from '../../../utils/commands';
import { sanitiseMarksInSelection } from '../../../utils';
import { liftFollowingList, liftTextSelectionList, liftNodeSelectionList } from '../transforms';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD, addAnalytics } from '../../analytics';
import { isInsideListItem, canJoinToPreviousListItem, selectionContainsList } from '../utils/selection';
import { getCommonListAnalyticsAttributes } from '../utils/analytics';
import { listBackspace } from './listBackspace';
import { joinListItemForward } from './join-list-item-forward';
import { convertListType } from '../actions/conversions';
import { wrapInListAndJoin } from '../actions/wrap-and-join-lists';
import { outdentList } from './outdent-list';
import { indentList } from './indent-list';
import { moveTargetIntoList } from '../utils/replace-content';
export { outdentList, indentList };
export const enterKeyCommand = (state, dispatch) => {
  const {
    selection
  } = state;

  if (selection.empty) {
    const {
      $from
    } = selection;
    const {
      listItem,
      codeBlock
    } = state.schema.nodes;
    const wrapper = $from.node($from.depth - 1);

    if (wrapper && wrapper.type === listItem) {
      /** Check if the wrapper has any visible content */
      const wrapperHasContent = hasVisibleContent(wrapper);

      if (!wrapperHasContent) {
        return outdentList(INPUT_METHOD.KEYBOARD)(state, dispatch);
      } else if (!hasParentNodeOfType(codeBlock)(selection)) {
        return splitListItem(listItem)(state, dispatch);
      }
    }
  }

  return false;
};
export const backspaceKeyCommand = (state, dispatch) => {
  return baseCommand.chainCommands(listBackspace, // if we're at the start of a list item, we need to either backspace
  // directly to an empty list item above, or outdent this node
  filter([isEmptySelectionAtStart, // list items might have multiple paragraphs; only do this at the first one
  isFirstChildOfParent, isInsideListItem], baseCommand.chainCommands(deletePreviousEmptyListItem, outdentList(INPUT_METHOD.KEYBOARD))), // if we're just inside a paragraph node (or gapcursor is shown) and backspace, then try to join
  // the text to the previous list item, if one exists
  filter([isEmptySelectionAtStart, canJoinToPreviousListItem], joinToPreviousListItem))(state, dispatch);
};
export const deleteKeyCommand = joinListItemForward; // Get the depth of the nearest ancestor list

export const rootListDepth = (pos, nodes) => {
  const {
    bulletList,
    orderedList,
    listItem
  } = nodes;
  let depth;

  for (let i = pos.depth - 1; i > 0; i--) {
    const node = pos.node(i);

    if (node.type === bulletList || node.type === orderedList) {
      depth = i;
    }

    if (node.type !== bulletList && node.type !== orderedList && node.type !== listItem) {
      break;
    }
  }

  return depth;
};

function untoggleSelectedList(tr) {
  const {
    selection
  } = tr;
  const depth = rootListDepth(selection.$to, tr.doc.type.schema.nodes);
  tr = liftFollowingList(selection.$to.pos, selection.$to.end(depth), depth || 0, tr);

  if (selection instanceof NodeSelection || selection instanceof GapCursorSelection) {
    return liftNodeSelectionList(selection, tr);
  }

  return liftTextSelectionList(selection, tr);
}

export function toggleList(inputMethod, listType) {
  return function (state, dispatch) {
    let tr = state.tr;
    const listInsideSelection = selectionContainsList(tr);
    const listNodeType = state.schema.nodes[listType];
    const actionSubjectId = listType === 'bulletList' ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

    if (listInsideSelection) {
      const {
        selection
      } = state; // for gap cursor or node selection - list is expected 1 level up (listItem -> list)
      // for text selection - list is expected 2 levels up (paragraph -> listItem -> list)

      const positionDiff = selection instanceof GapCursorSelection || selection instanceof NodeSelection ? 1 : 2;
      const fromNode = selection.$from.node(selection.$from.depth - positionDiff);
      const toNode = selection.$to.node(selection.$to.depth - positionDiff);
      const transformedFrom = listInsideSelection.type.name === 'bulletList' ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

      if ((fromNode === null || fromNode === void 0 ? void 0 : fromNode.type.name) === listType && (toNode === null || toNode === void 0 ? void 0 : toNode.type.name) === listType) {
        let tr = state.tr;
        untoggleSelectedList(tr);
        addAnalytics(state, tr, {
          action: ACTION.CONVERTED,
          actionSubject: ACTION_SUBJECT.LIST,
          actionSubjectId: ACTION_SUBJECT_ID.TEXT,
          eventType: EVENT_TYPE.TRACK,
          attributes: { ...getCommonListAnalyticsAttributes(state),
            transformedFrom,
            inputMethod
          }
        });

        if (dispatch) {
          dispatch(tr);
        }

        return true;
      }

      convertListType({
        tr,
        nextListNodeType: listNodeType
      });
      addAnalytics(state, tr, {
        action: ACTION.CONVERTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId,
        eventType: EVENT_TYPE.TRACK,
        attributes: { ...getCommonListAnalyticsAttributes(state),
          transformedFrom,
          inputMethod
        }
      });
    } else {
      // Need to have this before wrapInList so the wrapping is done with valid content
      // For example, if trying to convert centre or right aligned paragraphs to lists
      sanitiseMarksInSelection(tr, listNodeType);
      wrapInListAndJoin(listNodeType, tr);
      addAnalytics(state, tr, {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          inputMethod
        }
      });
    } // If document wasn't changed, return false from the command to indicate that the
    // editing action failed


    if (!tr.docChanged) {
      return false;
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
export function toggleBulletList(view, inputMethod = INPUT_METHOD.TOOLBAR) {
  return toggleList(inputMethod, 'bulletList')(view.state, view.dispatch);
}
export function toggleOrderedList(view, inputMethod = INPUT_METHOD.TOOLBAR) {
  return toggleList(inputMethod, 'orderedList')(view.state, view.dispatch);
}
/**
 * Implementation taken and modified for our needs from PM
 * @param itemType Node
 * Splits the list items, specific implementation take from PM
 */

function splitListItem(itemType) {
  return function (state, dispatch) {
    const ref = state.selection;
    const $from = ref.$from;
    const $to = ref.$to;
    const node = ref.node;

    if (node && node.isBlock || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }

    const grandParent = $from.node(-1);

    if (grandParent.type !== itemType) {
      return false;
    }
    /** --> The following line changed from the original PM implementation to allow list additions with multiple paragraphs */


    if (grandParent.content.content.length <= 1 && $from.parent.content.size === 0 && !(grandParent.content.size === 0)) {
      // In an empty block. If this is a nested list, the wrapping
      // list item should be split. Otherwise, bail out and let next
      // command handle lifting.
      if ($from.depth === 2 || $from.node(-3).type !== itemType || $from.index(-2) !== $from.node(-2).childCount - 1) {
        return false;
      }

      if (dispatch) {
        let wrap = Fragment.empty;
        const keepItem = $from.index(-1) > 0; // Build a fragment containing empty versions of the structure
        // from the outer list item to the parent node of the cursor

        for (let d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
          wrap = Fragment.from($from.node(d).copy(wrap));
        } // Add a second list item with an empty default start node


        wrap = wrap.append(Fragment.from(itemType.createAndFill()));
        const tr$1 = state.tr.replace($from.before(keepItem ? undefined : -1), $from.after(-3), new Slice(wrap, keepItem ? 3 : 2, 2));
        tr$1.setSelection(state.selection.constructor.near(tr$1.doc.resolve($from.pos + (keepItem ? 3 : 2))));
        dispatch(tr$1.scrollIntoView());
      }

      return true;
    }

    const nextType = $to.pos === $from.end() ? grandParent.contentMatchAt(0).defaultType : undefined;
    const tr = state.tr.delete($from.pos, $to.pos);
    const types = nextType && [undefined, {
      type: nextType
    }];

    if (dispatch) {
      dispatch(tr.split($from.pos, 2, types).scrollIntoView());
    }

    return true;
  };
}

const deletePreviousEmptyListItem = (state, dispatch) => {
  const {
    $from
  } = state.selection;
  const {
    listItem
  } = state.schema.nodes;
  const $cut = findCutBefore($from);

  if (!$cut || !$cut.nodeBefore || !($cut.nodeBefore.type === listItem)) {
    return false;
  }

  const previousListItemEmpty = $cut.nodeBefore.childCount === 1 && $cut.nodeBefore.firstChild.nodeSize <= 2;

  if (previousListItemEmpty) {
    const {
      tr
    } = state;

    if (dispatch) {
      dispatch(tr.delete($cut.pos - $cut.nodeBefore.nodeSize, $from.pos).scrollIntoView());
    }

    return true;
  }

  return false;
};

const joinToPreviousListItem = (state, dispatch) => {
  const {
    $from
  } = state.selection;
  const {
    paragraph,
    listItem,
    codeBlock,
    bulletList,
    orderedList
  } = state.schema.nodes;
  const isGapCursorShown = state.selection instanceof GapCursorSelection;
  const $cutPos = isGapCursorShown ? state.doc.resolve($from.pos + 1) : $from;
  let $cut = findCutBefore($cutPos);

  if (!$cut) {
    return false;
  } // see if the containing node is a list


  if ($cut.nodeBefore && [bulletList, orderedList].indexOf($cut.nodeBefore.type) > -1) {
    // and the node after this is a paragraph or a codeBlock
    if ($cut.nodeAfter && ($cut.nodeAfter.type === paragraph || $cut.nodeAfter.type === codeBlock)) {
      // find the nearest paragraph that precedes this node
      let $lastNode = $cut.doc.resolve($cut.pos - 1);

      while ($lastNode.parent.type !== paragraph) {
        $lastNode = state.doc.resolve($lastNode.pos - 1);
      }

      let {
        tr
      } = state;

      if (isGapCursorShown) {
        const nodeBeforePos = findPositionOfNodeBefore(tr.selection);

        if (typeof nodeBeforePos !== 'number') {
          return false;
        } // append the codeblock to the list node


        const list = $cut.nodeBefore.copy($cut.nodeBefore.content.append(Fragment.from(listItem.createChecked({}, $cut.nodeAfter))));
        tr.replaceWith(nodeBeforePos, $from.pos + $cut.nodeAfter.nodeSize, list);
      } else {
        const step = moveTargetIntoList({
          insertPosition: $lastNode.pos,
          $target: $cut
        }); // ED-13966: check if the step will cause an ProseMirror error
        // if there's an error don't apply the step as it will might lead into a data loss.
        // It doesn't play well with media being a leaf node.

        const stepResult = state.tr.maybeStep(step);

        if (stepResult.failed) {
          return false;
        } else {
          tr = state.tr.step(step);
        }
      } // find out if there's now another list following and join them
      // as in, [list, p, list] => [list with p, list], and we want [joined list]


      let $postCut = tr.doc.resolve(tr.mapping.map($cut.pos + $cut.nodeAfter.nodeSize));

      if ($postCut.nodeBefore && $postCut.nodeAfter && $postCut.nodeBefore.type === $postCut.nodeAfter.type && [bulletList, orderedList].indexOf($postCut.nodeBefore.type) > -1) {
        tr = tr.join($postCut.pos);
      }

      if (dispatch) {
        var _tr$doc$resolve$nodeB;

        if (!((_tr$doc$resolve$nodeB = tr.doc.resolve($lastNode.pos).nodeBefore) !== null && _tr$doc$resolve$nodeB !== void 0 && _tr$doc$resolve$nodeB.isBlock) || tr.doc.resolve($lastNode.pos).nodeBefore === null) {
          tr = tr.setSelection(TextSelection.near(tr.doc.resolve(tr.mapping.map($cut.pos)), -1));
        }

        dispatch(tr.scrollIntoView());
      }

      return true;
    }
  }

  return false;
};