"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLoadItems = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _updateListItems = require("../../commands/update-list-items");

var EMPTY_LIST_ITEM = [];

var useLoadItems = function useLoadItems(triggerHandler, editorView, query) {
  var _useState = (0, _react.useState)(EMPTY_LIST_ITEM),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      items = _useState2[0],
      setItems = _useState2[1];

  var componentIsMounted = (0, _react.useRef)(true);
  var editorViewRef = (0, _react.useRef)(editorView);
  (0, _react.useEffect)(function () {
    var getItems = triggerHandler === null || triggerHandler === void 0 ? void 0 : triggerHandler.getItems;

    if (!getItems) {
      setItems(EMPTY_LIST_ITEM);
      return;
    }

    var options = {
      query: query || '',
      editorState: editorView.state
    };
    var view = editorViewRef.current;
    getItems(options).then(function (result) {
      var list = result.length > 0 ? result : EMPTY_LIST_ITEM;

      if (componentIsMounted.current) {
        setItems(list);
      }

      queueMicrotask(function () {
        (0, _updateListItems.updateListItem)(list)(view.state, view.dispatch);
      });
    }); // ignore because EditorView is mutable but we don't want to
    // call loadItems when it changes, only when the query changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerHandler, query]);
  (0, _react.useEffect)(function () {
    return function () {
      componentIsMounted.current = false;
    };
  }, []);
  return items;
};

exports.useLoadItems = useLoadItems;