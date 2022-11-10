"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indentList = indentList;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _analytics = require("../../analytics");

var _indentation = require("../utils/indentation");

var _indentListItemsSelected = require("../actions/indent-list-items-selected");

var _node = require("../utils/node");

var _find = require("../utils/find");

var _types = require("../types");

var _selection = require("../utils/selection");

var _analytics2 = require("../utils/analytics");

var _prosemirrorHistory = require("prosemirror-history");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function indentList() {
  var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _analytics.INPUT_METHOD.KEYBOARD;
  return function (state, dispatch) {
    var tr = state.tr,
        $from = state.selection.$from; // don't indent if selection is not inside a list

    if (!(0, _selection.isInsideListItem)(state)) {
      return false;
    } // Save the history, so it could undo/revert to the same state before the indent, see https://product-fabric.atlassian.net/browse/ED-14753


    (0, _prosemirrorHistory.closeHistory)(tr);
    var firstListItemSelectedAttributes = (0, _selection.getListItemAttributes)($from);
    var parentListNode = (0, _find.findFirstParentListNode)($from);

    if (!parentListNode || firstListItemSelectedAttributes && firstListItemSelectedAttributes.indentLevel === 0 && firstListItemSelectedAttributes.itemIndex === 0) {
      if ((0, _selection.isInsideTableCell)(state)) {
        // dont consume tab, as table-keymap should move cursor to next cell
        return false;
      } else {
        // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
        return true;
      }
    }

    var currentListNode = parentListNode.node;
    var actionSubjectId = (0, _node.isBulletList)(currentListNode) ? _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
    (0, _indentListItemsSelected.indentListItemsSelected)(tr);
    var maximimunNestedLevelReached = !(0, _indentation.hasValidListIndentationLevel)({
      tr: tr,
      maxIndentation: _types.MAX_NESTED_LIST_INDENTATION
    });

    if (maximimunNestedLevelReached || !tr.docChanged) {
      // Even though this is a non-operation, we don't want to send this event to the browser. Because if we return false, the browser will move the focus to another place
      return true;
    }

    (0, _analytics.addAnalytics)(state, tr, {
      action: _analytics.ACTION.INDENTED,
      actionSubject: _analytics.ACTION_SUBJECT.LIST,
      actionSubjectId: actionSubjectId,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: _objectSpread(_objectSpread({}, (0, _analytics2.getCommonListAnalyticsAttributes)(state)), {}, {
        inputMethod: inputMethod
      })
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}