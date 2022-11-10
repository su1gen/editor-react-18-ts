"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinListItemForward = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _commands = require("../../../utils/commands");

var _analytics = require("../../analytics");

var _prosemirrorUtils = require("prosemirror-utils");

var _joinListItemsForward = require("../actions/join-list-items-forward");

var joinListItemForward = function joinListItemForward(state, dispatch) {
  var tr = state.tr,
      $head = state.selection.$head;
  var walkNode = (0, _commands.walkNextNode)($head);

  if (!(0, _commands.isEmptySelectionAtEnd)(state)) {
    return false;
  }

  var scenarios = (0, _joinListItemsForward.calcJoinListScenario)(walkNode, $head);

  if (!scenarios) {
    return false;
  }

  var _scenarios = (0, _slicedToArray2.default)(scenarios, 2),
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
  var listParent = (0, _prosemirrorUtils.findParentNodeOfType)([bulletList, orderedList])(tr.selection);
  var actionSubjectId = _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_BULLET;

  if (listParent && listParent.node.type === orderedList) {
    actionSubjectId = _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
  }

  (0, _analytics.addAnalytics)(state, tr, {
    action: _analytics.ACTION.LIST_ITEM_JOINED,
    actionSubject: _analytics.ACTION_SUBJECT.LIST,
    actionSubjectId: actionSubjectId,
    eventType: _analytics.EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.KEYBOARD,
      direction: _analytics.DELETE_DIRECTION.FORWARD,
      scenario: scenario
    }
  });

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

exports.joinListItemForward = joinListItemForward;