"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outdentList = outdentList;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _analytics = require("../../analytics");

var _selection = require("../utils/selection");

var _node = require("../utils/node");

var _find = require("../utils/find");

var _analytics2 = require("../utils/analytics");

var _outdentListItemsSelected = require("../actions/outdent-list-items-selected");

var _prosemirrorHistory = require("prosemirror-history");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function outdentList() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _analytics.INPUT_METHOD.KEYBOARD;
  return function (state, dispatch) {
    if (!(0, _selection.isInsideListItem)(state)) {
      return false;
    }

    var $from = state.selection.$from;
    var parentListNode = (0, _find.findFirstParentListNode)($from);

    if (!parentListNode) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      return true;
    } // Save the history, so it could undo/revert to the same state before the outdent, see https://product-fabric.atlassian.net/browse/ED-14753


    (0, _prosemirrorHistory.closeHistory)(state.tr);
    var actionSubjectId = (0, _node.isBulletList)(parentListNode.node) ? _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
    var customTr = state.tr;
    (0, _outdentListItemsSelected.outdentListItemsSelected)(customTr);

    if (!customTr || !customTr.docChanged) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      // If inside table cell and can't outdent list, then let it handle by table keymap
      return !(0, _selection.isInsideTableCell)(state);
    }

    (0, _analytics.addAnalytics)(state, customTr, {
      action: _analytics.ACTION.OUTDENTED,
      actionSubject: _analytics.ACTION_SUBJECT.LIST,
      actionSubjectId: actionSubjectId,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: _objectSpread(_objectSpread({}, (0, _analytics2.getCommonListAnalyticsAttributes)(state)), {}, {
        inputMethod: inputMethod
      })
    });

    if (dispatch) {
      dispatch(customTr);
    }

    return true;
  };
}