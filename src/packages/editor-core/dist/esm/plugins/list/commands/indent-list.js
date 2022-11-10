import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD, addAnalytics } from '../../analytics';
import { hasValidListIndentationLevel } from '../utils/indentation';
import { indentListItemsSelected as indentListAction } from '../actions/indent-list-items-selected';
import { isBulletList } from '../utils/node';
import { findFirstParentListNode } from '../utils/find';
import { MAX_NESTED_LIST_INDENTATION } from '../types';
import { isInsideListItem, isInsideTableCell, getListItemAttributes } from '../utils/selection';
import { getCommonListAnalyticsAttributes } from '../utils/analytics';
import { closeHistory } from 'prosemirror-history';
export function indentList() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INPUT_METHOD.KEYBOARD;
  return function (state, dispatch) {
    var tr = state.tr,
        $from = state.selection.$from; // don't indent if selection is not inside a list

    if (!isInsideListItem(state)) {
      return false;
    } // Save the history, so it could undo/revert to the same state before the indent, see https://product-fabric.atlassian.net/browse/ED-14753


    closeHistory(tr);
    var firstListItemSelectedAttributes = getListItemAttributes($from);
    var parentListNode = findFirstParentListNode($from);

    if (!parentListNode || firstListItemSelectedAttributes && firstListItemSelectedAttributes.indentLevel === 0 && firstListItemSelectedAttributes.itemIndex === 0) {
      if (isInsideTableCell(state)) {
        // dont consume tab, as table-keymap should move cursor to next cell
        return false;
      } else {
        // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
        return true;
      }
    }

    var currentListNode = parentListNode.node;
    var actionSubjectId = isBulletList(currentListNode) ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
    indentListAction(tr);
    var maximimunNestedLevelReached = !hasValidListIndentationLevel({
      tr: tr,
      maxIndentation: MAX_NESTED_LIST_INDENTATION
    });

    if (maximimunNestedLevelReached || !tr.docChanged) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      return true;
    }

    addAnalytics(state, tr, {
      action: ACTION.INDENTED,
      actionSubject: ACTION_SUBJECT.LIST,
      actionSubjectId: actionSubjectId,
      eventType: EVENT_TYPE.TRACK,
      attributes: _objectSpread(_objectSpread({}, getCommonListAnalyticsAttributes(state)), {}, {
        inputMethod: inputMethod
      })
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}