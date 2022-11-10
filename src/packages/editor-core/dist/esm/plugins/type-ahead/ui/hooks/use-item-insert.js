import { useLayoutEffect, useCallback, useRef } from 'react';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { closeTypeAhead } from '../../transforms/close-type-ahead';
import { setSelectionBeforeQuery } from '../../transforms/set-selection-before-query';
import { insertTypeAheadItem } from '../../commands/insert-type-ahead-item';
import { CloseSelectionOptions } from '../../constants';

var insertRawQuery = function insertRawQuery(_ref) {
  var view = _ref.view,
      setSelectionAt = _ref.setSelectionAt,
      text = _ref.text,
      forceFocusOnEditor = _ref.forceFocusOnEditor;
  var _view$state = view.state,
      tr = _view$state.tr,
      schema = _view$state.schema;
  closeTypeAhead(tr);

  if (text.length > 0) {
    tr.replaceSelectionWith(schema.text(text));

    if (setSelectionAt === CloseSelectionOptions.BEFORE_TEXT_INSERTED) {
      setSelectionBeforeQuery(text)(tr);
    }
  }

  view.dispatch(tr);

  if (forceFocusOnEditor) {
    view.focus();
  }
};

export var useItemInsert = function useItemInsert(triggerHandler, editorView, items) {
  var editorViewRef = useRef(editorView);
  var itemsRef = useRef(items);
  var onTextInsert = useCallback(function (_ref2) {
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
  var onItemInsert = useCallback(function (_ref3) {
    var mode = _ref3.mode,
        index = _ref3.index,
        query = _ref3.query;
    var sourceListItem = itemsRef.current;

    if (sourceListItem.length === 0 || !triggerHandler) {
      var text = "".concat(triggerHandler.trigger).concat(query);
      onTextInsert({
        forceFocusOnEditor: true,
        setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
        text: text
      });
      return;
    }

    var itemToInsert = sourceListItem[index];

    if (!itemToInsert) {
      return;
    }

    var view = editorViewRef.current;
    insertTypeAheadItem(view)({
      item: itemToInsert,
      handler: triggerHandler,
      mode: mode,
      query: query,
      sourceListItem: sourceListItem
    });
  }, [triggerHandler, onTextInsert]);
  var onItemMatch = useCallback(function (_ref4) {
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
          setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
          text: mode === SelectItemMode.SPACE ? text.concat(' ') : text
        });
      });
    }

    return true;
  }, [onItemInsert, triggerHandler, onTextInsert]);
  useLayoutEffect(function () {
    itemsRef.current = items;
  }, [items]);
  return [onItemInsert, onTextInsert, onItemMatch];
};