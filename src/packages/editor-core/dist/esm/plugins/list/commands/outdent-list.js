import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { addAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD } from '../../analytics';
import { isInsideListItem, isInsideTableCell } from '../utils/selection';
import { isBulletList } from '../utils/node';
import { findFirstParentListNode } from '../utils/find';
import { getCommonListAnalyticsAttributes } from '../utils/analytics';
import { outdentListItemsSelected as outdentListAction } from '../actions/outdent-list-items-selected';
import { closeHistory } from 'prosemirror-history';
export function outdentList() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INPUT_METHOD.KEYBOARD;
  return function (state, dispatch) {
    if (!isInsideListItem(state)) {
      return false;
    }

    var $from = state.selection.$from;
    var parentListNode = findFirstParentListNode($from);

    if (!parentListNode) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      return true;
    } // Save the history, so it could undo/revert to the same state before the outdent, see https://product-fabric.atlassian.net/browse/ED-14753


    closeHistory(state.tr);
    var actionSubjectId = isBulletList(parentListNode.node) ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
    var customTr = state.tr;
    outdentListAction(customTr);

    if (!customTr || !customTr.docChanged) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      // If inside table cell and can't outdent list, then let it handle by table keymap
      return !isInsideTableCell(state);
    }

    addAnalytics(state, customTr, {
      action: ACTION.OUTDENTED,
      actionSubject: ACTION_SUBJECT.LIST,
      actionSubjectId: actionSubjectId,
      eventType: EVENT_TYPE.TRACK,
      attributes: _objectSpread(_objectSpread({}, getCommonListAnalyticsAttributes(state)), {}, {
        inputMethod: inputMethod
      })
    });

    if (dispatch) {
      dispatch(customTr);
    }

    return true;
  };
}