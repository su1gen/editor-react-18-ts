import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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
export var enterKeyCommand = function enterKeyCommand(state, dispatch) {
  var selection = state.selection;

  if (selection.empty) {
    var $from = selection.$from;
    var _state$schema$nodes = state.schema.nodes,
        listItem = _state$schema$nodes.listItem,
        codeBlock = _state$schema$nodes.codeBlock;
    var wrapper = $from.node($from.depth - 1);

    if (wrapper && wrapper.type === listItem) {
      /** Check if the wrapper has any visible content */
      var wrapperHasContent = hasVisibleContent(wrapper);

      if (!wrapperHasContent) {
        return outdentList(INPUT_METHOD.KEYBOARD)(state, dispatch);
      } else if (!hasParentNodeOfType(codeBlock)(selection)) {
        return splitListItem(listItem)(state, dispatch);
      }
    }
  }

  return false;
};
export var backspaceKeyCommand = function backspaceKeyCommand(state, dispatch) {
  return baseCommand.chainCommands(listBackspace, // if we're at the start of a list item, we need to either backspace
  // directly to an empty list item above, or outdent this node
  filter([isEmptySelectionAtStart, // list items might have multiple paragraphs; only do this at the first one
  isFirstChildOfParent, isInsideListItem], baseCommand.chainCommands(deletePreviousEmptyListItem, outdentList(INPUT_METHOD.KEYBOARD))), // if we're just inside a paragraph node (or gapcursor is shown) and backspace, then try to join
  // the text to the previous list item, if one exists
  filter([isEmptySelectionAtStart, canJoinToPreviousListItem], joinToPreviousListItem))(state, dispatch);
};
export var deleteKeyCommand = joinListItemForward; // Get the depth of the nearest ancestor list

export var rootListDepth = function rootListDepth(pos, nodes) {
  var bulletList = nodes.bulletList,
      orderedList = nodes.orderedList,
      listItem = nodes.listItem;
  var depth;

  for (var i = pos.depth - 1; i > 0; i--) {
    var node = pos.node(i);

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
  var _tr = tr,
      selection = _tr.selection;
  var depth = rootListDepth(selection.$to, tr.doc.type.schema.nodes);
  tr = liftFollowingList(selection.$to.pos, selection.$to.end(depth), depth || 0, tr);

  if (selection instanceof NodeSelection || selection instanceof GapCursorSelection) {
    return liftNodeSelectionList(selection, tr);
  }

  return liftTextSelectionList(selection, tr);
}

export function toggleList(inputMethod, listType) {
  return function (state, dispatch) {
    var tr = state.tr;
    var listInsideSelection = selectionContainsList(tr);
    var listNodeType = state.schema.nodes[listType];
    var actionSubjectId = listType === 'bulletList' ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

    if (listInsideSelection) {
      var selection = state.selection; // for gap cursor or node selection - list is expected 1 level up (listItem -> list)
      // for text selection - list is expected 2 levels up (paragraph -> listItem -> list)

      var positionDiff = selection instanceof GapCursorSelection || selection instanceof NodeSelection ? 1 : 2;
      var fromNode = selection.$from.node(selection.$from.depth - positionDiff);
      var toNode = selection.$to.node(selection.$to.depth - positionDiff);
      var transformedFrom = listInsideSelection.type.name === 'bulletList' ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

      if ((fromNode === null || fromNode === void 0 ? void 0 : fromNode.type.name) === listType && (toNode === null || toNode === void 0 ? void 0 : toNode.type.name) === listType) {
        var _tr2 = state.tr;
        untoggleSelectedList(_tr2);
        addAnalytics(state, _tr2, {
          action: ACTION.CONVERTED,
          actionSubject: ACTION_SUBJECT.LIST,
          actionSubjectId: ACTION_SUBJECT_ID.TEXT,
          eventType: EVENT_TYPE.TRACK,
          attributes: _objectSpread(_objectSpread({}, getCommonListAnalyticsAttributes(state)), {}, {
            transformedFrom: transformedFrom,
            inputMethod: inputMethod
          })
        });

        if (dispatch) {
          dispatch(_tr2);
        }

        return true;
      }

      convertListType({
        tr: tr,
        nextListNodeType: listNodeType
      });
      addAnalytics(state, tr, {
        action: ACTION.CONVERTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId: actionSubjectId,
        eventType: EVENT_TYPE.TRACK,
        attributes: _objectSpread(_objectSpread({}, getCommonListAnalyticsAttributes(state)), {}, {
          transformedFrom: transformedFrom,
          inputMethod: inputMethod
        })
      });
    } else {
      // Need to have this before wrapInList so the wrapping is done with valid content
      // For example, if trying to convert centre or right aligned paragraphs to lists
      sanitiseMarksInSelection(tr, listNodeType);
      wrapInListAndJoin(listNodeType, tr);
      addAnalytics(state, tr, {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId: actionSubjectId,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: inputMethod
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
export function toggleBulletList(view) {
  var inputMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INPUT_METHOD.TOOLBAR;
  return toggleList(inputMethod, 'bulletList')(view.state, view.dispatch);
}
export function toggleOrderedList(view) {
  var inputMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INPUT_METHOD.TOOLBAR;
  return toggleList(inputMethod, 'orderedList')(view.state, view.dispatch);
}
/**
 * Implementation taken and modified for our needs from PM
 * @param itemType Node
 * Splits the list items, specific implementation take from PM
 */

function splitListItem(itemType) {
  return function (state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    var node = ref.node;

    if (node && node.isBlock || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }

    var grandParent = $from.node(-1);

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
        var wrap = Fragment.empty;
        var keepItem = $from.index(-1) > 0; // Build a fragment containing empty versions of the structure
        // from the outer list item to the parent node of the cursor

        for (var d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
          wrap = Fragment.from($from.node(d).copy(wrap));
        } // Add a second list item with an empty default start node


        wrap = wrap.append(Fragment.from(itemType.createAndFill()));
        var tr$1 = state.tr.replace($from.before(keepItem ? undefined : -1), $from.after(-3), new Slice(wrap, keepItem ? 3 : 2, 2));
        tr$1.setSelection(state.selection.constructor.near(tr$1.doc.resolve($from.pos + (keepItem ? 3 : 2))));
        dispatch(tr$1.scrollIntoView());
      }

      return true;
    }

    var nextType = $to.pos === $from.end() ? grandParent.contentMatchAt(0).defaultType : undefined;
    var tr = state.tr.delete($from.pos, $to.pos);
    var types = nextType && [undefined, {
      type: nextType
    }];

    if (dispatch) {
      dispatch(tr.split($from.pos, 2, types).scrollIntoView());
    }

    return true;
  };
}

var deletePreviousEmptyListItem = function deletePreviousEmptyListItem(state, dispatch) {
  var $from = state.selection.$from;
  var listItem = state.schema.nodes.listItem;
  var $cut = findCutBefore($from);

  if (!$cut || !$cut.nodeBefore || !($cut.nodeBefore.type === listItem)) {
    return false;
  }

  var previousListItemEmpty = $cut.nodeBefore.childCount === 1 && $cut.nodeBefore.firstChild.nodeSize <= 2;

  if (previousListItemEmpty) {
    var tr = state.tr;

    if (dispatch) {
      dispatch(tr.delete($cut.pos - $cut.nodeBefore.nodeSize, $from.pos).scrollIntoView());
    }

    return true;
  }

  return false;
};

var joinToPreviousListItem = function joinToPreviousListItem(state, dispatch) {
  var $from = state.selection.$from;
  var _state$schema$nodes2 = state.schema.nodes,
      paragraph = _state$schema$nodes2.paragraph,
      listItem = _state$schema$nodes2.listItem,
      codeBlock = _state$schema$nodes2.codeBlock,
      bulletList = _state$schema$nodes2.bulletList,
      orderedList = _state$schema$nodes2.orderedList;
  var isGapCursorShown = state.selection instanceof GapCursorSelection;
  var $cutPos = isGapCursorShown ? state.doc.resolve($from.pos + 1) : $from;
  var $cut = findCutBefore($cutPos);

  if (!$cut) {
    return false;
  } // see if the containing node is a list


  if ($cut.nodeBefore && [bulletList, orderedList].indexOf($cut.nodeBefore.type) > -1) {
    // and the node after this is a paragraph or a codeBlock
    if ($cut.nodeAfter && ($cut.nodeAfter.type === paragraph || $cut.nodeAfter.type === codeBlock)) {
      // find the nearest paragraph that precedes this node
      var $lastNode = $cut.doc.resolve($cut.pos - 1);

      while ($lastNode.parent.type !== paragraph) {
        $lastNode = state.doc.resolve($lastNode.pos - 1);
      }

      var tr = state.tr;

      if (isGapCursorShown) {
        var nodeBeforePos = findPositionOfNodeBefore(tr.selection);

        if (typeof nodeBeforePos !== 'number') {
          return false;
        } // append the codeblock to the list node


        var list = $cut.nodeBefore.copy($cut.nodeBefore.content.append(Fragment.from(listItem.createChecked({}, $cut.nodeAfter))));
        tr.replaceWith(nodeBeforePos, $from.pos + $cut.nodeAfter.nodeSize, list);
      } else {
        var step = moveTargetIntoList({
          insertPosition: $lastNode.pos,
          $target: $cut
        }); // ED-13966: check if the step will cause an ProseMirror error
        // if there's an error don't apply the step as it will might lead into a data loss.
        // It doesn't play well with media being a leaf node.

        var stepResult = state.tr.maybeStep(step);

        if (stepResult.failed) {
          return false;
        } else {
          tr = state.tr.step(step);
        }
      } // find out if there's now another list following and join them
      // as in, [list, p, list] => [list with p, list], and we want [joined list]


      var $postCut = tr.doc.resolve(tr.mapping.map($cut.pos + $cut.nodeAfter.nodeSize));

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