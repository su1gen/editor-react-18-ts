import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { isEmptySelectionAtEnd, walkNextNode } from '../../../utils/commands';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD, DELETE_DIRECTION, addAnalytics } from '../../analytics';
import { findParentNodeOfType } from 'prosemirror-utils';
import { calcJoinListScenario } from '../actions/join-list-items-forward';
export var joinListItemForward = function joinListItemForward(state, dispatch) {
  var tr = state.tr,
      $head = state.selection.$head;
  var walkNode = walkNextNode($head);

  if (!isEmptySelectionAtEnd(state)) {
    return false;
  }

  var scenarios = calcJoinListScenario(walkNode, $head);

  if (!scenarios) {
    return false;
  }

  var _scenarios = _slicedToArray(scenarios, 2),
      scenario = _scenarios[0],
      action = _scenarios[1];

  var result = action({
    tr: tr,
    $next: walkNode.$pos,
    $head: $head
  });

  if (!result) {
    return false;
  }

  var _state$schema$nodes = state.schema.nodes,
      bulletList = _state$schema$nodes.bulletList,
      orderedList = _state$schema$nodes.orderedList;
  var listParent = findParentNodeOfType([bulletList, orderedList])(tr.selection);
  var actionSubjectId = ACTION_SUBJECT_ID.FORMAT_LIST_BULLET;

  if (listParent && listParent.node.type === orderedList) {
    actionSubjectId = ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
  }

  addAnalytics(state, tr, {
    action: ACTION.LIST_ITEM_JOINED,
    actionSubject: ACTION_SUBJECT.LIST,
    actionSubjectId: actionSubjectId,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.KEYBOARD,
      direction: DELETE_DIRECTION.FORWARD,
      scenario: scenario
    }
  });

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};