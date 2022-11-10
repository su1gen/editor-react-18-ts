"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useItemInsert = void 0;

var _react = require("react");

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _closeTypeAhead = require("../../transforms/close-type-ahead");

var _setSelectionBeforeQuery = require("../../transforms/set-selection-before-query");

var _insertTypeAheadItem = require("../../commands/insert-type-ahead-item");

var _constants = require("../../constants");

var insertRawQuery = function insertRawQuery(_ref) {
  var view = _ref.view,
      setSelectionAt = _ref.setSelectionAt,
      text = _ref.text,
      forceFocusOnEditor = _ref.forceFocusOnEditor;
  var _view$state = view.state,
      tr = _view$state.tr,
      schema = _view$state.schema;
  (0, _closeTypeAhead.closeTypeAhead)(tr);

  if (text.length > 0) {
    tr.replaceSelectionWith(schema.text(text));

    if (setSelectionAt === _constants.CloseSelectionOptions.BEFORE_TEXT_INSERTED) {
      (0, _setSelectionBeforeQuery.setSelectionBeforeQuery)(text)(tr);
    }
  }

  view.dispatch(tr);

  if (forceFocusOnEditor) {
    view.focus();
  }
};

var useItemInsert = function useItemInsert(triggerHandler, editorView, items) {
  var editorViewRef = (0, _react.useRef)(editorView);
  var itemsRef = (0, _react.useRef)(items);
  var onTextInsert = (0, _react.useCallback)(function (_ref2) {
    var setSelectionAt = _ref2.setSelectionAt,
        text = _ref2.text,
        forceFocusOnEditor = _ref2.forceFocusOnEditor;

    if (!triggerHandler) {
      return;
    }

    var view = editorViewRef.current;
    insertRawQuery({
      view: view,
      setSelectionAt: setSelectionAt,
      text: text,
      forceFocusOnEditor: forceFocusOnEditor
    });
  }, [triggerHandler]);
  var onItemInsert = (0, _react.useCallback)(function (_ref3) {
    var mode = _ref3.mode,
        index = _ref3.index,
        query = _ref3.query;
    var sourceListItem = itemsRef.current;

    if (sourceListItem.length === 0 || !triggerHandler) {
      var text = "".concat(triggerHandler.trigger).concat(query);
      onTextInsert({
        forceFocusOnEditor: true,
        setSelectionAt: _constants.CloseSelectionOptions.AFTER_TEXT_INSERTED,
        text: text
      });
      return;
    }

    var itemToInsert = sourceListItem[index];

    if (!itemToInsert) {
      return;
    }

    var view = editorViewRef.current;
    (0, _insertTypeAheadItem.insertTypeAheadItem)(view)({
      item: itemToInsert,
      handler: triggerHandler,
      mode: mode,
      query: query,
      sourceListItem: sourceListItem
    });
  }, [triggerHandler, onTextInsert]);
  var onItemMatch = (0, _react.useCallback)(function (_ref4) {
    var mode = _ref4.mode,
        query = _ref4.query;
    var _items = itemsRef.current;

    if (_items && _items.length > 1) {
      return false;
    }

    if (_items.length === 1) {
      queueMicrotask(function () {
        onItemInsert({
          mode: mode,
          query: query,
          index: 0
        });
      });
    } else {
      var text = "".concat(triggerHandler.trigger).concat(query);
      queueMicrotask(function () {
        onTextInsert({
          forceFocusOnEditor: true,
          setSelectionAt: _constants.CloseSelectionOptions.AFTER_TEXT_INSERTED,
          text: mode === _typeAhead.SelectItemMode.SPACE ? text.concat(' ') : text
        });
      });
    }

    return true;
  }, [onItemInsert, triggerHandler, onTextInsert]);
  (0, _react.useLayoutEffect)(function () {
    itemsRef.current = items;
  }, [items]);
  return [onItemInsert, onTextInsert, onItemMatch];
};

exports.useItemInsert = useItemInsert;