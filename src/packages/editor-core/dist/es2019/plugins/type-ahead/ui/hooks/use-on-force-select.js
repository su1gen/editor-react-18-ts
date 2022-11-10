import { useLayoutEffect, useRef } from 'react';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { insertTypeAheadItem } from '../../commands/insert-type-ahead-item';
export const useOnForceSelect = ({
  triggerHandler,
  items,
  query,
  editorView,
  closePopup
}) => {
  const editorViewRef = useRef(editorView);
  useLayoutEffect(() => {
    if (!query || typeof triggerHandler.forceSelect !== 'function') {
      return;
    }

    const item = triggerHandler.forceSelect({
      items,
      query,
      editorState: editorViewRef.current.state
    });

    if (!item) {
      return;
    }

    const {
      current: view
    } = editorViewRef;
    closePopup();
    queueMicrotask(() => {
      insertTypeAheadItem(view)({
        item,
        mode: SelectItemMode.SPACE,
        query,
        handler: triggerHandler,
        sourceListItem: items
      });
    });
  }, [triggerHandler, closePopup, query, items]);
};