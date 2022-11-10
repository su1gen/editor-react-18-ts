import { useLayoutEffect, useCallback, useRef } from 'react';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { closeTypeAhead } from '../../transforms/close-type-ahead';
import { setSelectionBeforeQuery } from '../../transforms/set-selection-before-query';
import { insertTypeAheadItem } from '../../commands/insert-type-ahead-item';
import { CloseSelectionOptions } from '../../constants';

const insertRawQuery = ({
  view,
  setSelectionAt,
  text,
  forceFocusOnEditor
}) => {
  const {
    tr,
    schema
  } = view.state;
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

export const useItemInsert = (triggerHandler, editorView, items) => {
  const editorViewRef = useRef(editorView);
  const itemsRef = useRef(items);
  const onTextInsert = useCallback(({
    setSelectionAt,
    text,
    forceFocusOnEditor
  }) => {
    if (!triggerHandler) {
      return;
    }

    const {
      current: view
    } = editorViewRef;
    insertRawQuery({
      view,
      setSelectionAt,
      text,
      forceFocusOnEditor
    });
  }, [triggerHandler]);
  const onItemInsert = useCallback(({
    mode,
    index,
    query
  }) => {
    const sourceListItem = itemsRef.current;

    if (sourceListItem.length === 0 || !triggerHandler) {
      const text = `${triggerHandler.trigger}${query}`;
      onTextInsert({
        forceFocusOnEditor: true,
        setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
        text
      });
      return;
    }

    const itemToInsert = sourceListItem[index];

    if (!itemToInsert) {
      return;
    }

    const {
      current: view
    } = editorViewRef;
    insertTypeAheadItem(view)({
      item: itemToInsert,
      handler: triggerHandler,
      mode,
      query,
      sourceListItem
    });
  }, [triggerHandler, onTextInsert]);
  const onItemMatch = useCallback(({
    mode,
    query
  }) => {
    const _items = itemsRef.current;

    if (_items && _items.length > 1) {
      return false;
    }

    if (_items.length === 1) {
      queueMicrotask(() => {
        onItemInsert({
          mode,
          query,
          index: 0
        });
      });
    } else {
      const text = `${triggerHandler.trigger}${query}`;
      queueMicrotask(() => {
        onTextInsert({
          forceFocusOnEditor: true,
          setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
          text: mode === SelectItemMode.SPACE ? text.concat(' ') : text
        });
      });
    }

    return true;
  }, [onItemInsert, triggerHandler, onTextInsert]);
  useLayoutEffect(() => {
    itemsRef.current = items;
  }, [items]);
  return [onItemInsert, onTextInsert, onItemMatch];
};