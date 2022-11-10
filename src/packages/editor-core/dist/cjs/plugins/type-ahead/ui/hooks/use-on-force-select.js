"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useOnForceSelect = void 0;

var _react = require("react");

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _insertTypeAheadItem = require("../../commands/insert-type-ahead-item");

var useOnForceSelect = function useOnForceSelect(_ref) {
  var triggerHandler = _ref.triggerHandler,
      items = _ref.items,
      query = _ref.query,
      editorView = _ref.editorView,
      closePopup = _ref.closePopup;
  var editorViewRef = (0, _react.useRef)(editorView);
  (0, _react.useLayoutEffect)(function () {
    if (!query || typeof triggerHandler.forceSelect !== 'function') {
      return;
    }

    var item = triggerHandler.forceSelect({
      items: items,
      query: query,
      editorState: editorViewRef.current.state
    });

    if (!item) {
      return;
    }

    var view = editorViewRef.current;
    closePopup();
    queueMicrotask(function () {
      (0, _insertTypeAheadItem.insertTypeAheadItem)(view)({
        item: item,
        mode: _typeAhead.SelectItemMode.SPACE,
        query: query,
        handler: triggerHandler,
        sourceListItem: items
      });
    });
  }, [triggerHandler, closePopup, query, items]);
};

exports.useOnForceSelect = useOnForceSelect;