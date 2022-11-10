import { useLayoutEffect, useRef } from 'react';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { insertTypeAheadItem } from '../../commands/insert-type-ahead-item';
export var useOnForceSelect = function useOnForceSelect(_ref) {
  var triggerHandler = _ref.triggerHandler,
      items = _ref.items,
      query = _ref.query,
      editorView = _ref.editorView,
      closePopup = _ref.closePopup;
  var editorViewRef = useRef(editorView);
  useLayoutEffect(function () {
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
      insertTypeAheadItem(view)({
        item: item,
        mode: SelectItemMode.SPACE,
        query: query,
        handler: triggerHandler,
        sourceListItem: items
      });
    });
  }, [triggerHandler, closePopup, query, items]);
};