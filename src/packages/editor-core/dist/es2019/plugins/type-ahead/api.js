import { TypeAheadAvailableNodes, SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { findHandler, findHandlerByTrigger, isTypeAheadOpen, getTypeAheadHandler, getTypeAheadQuery } from './utils';
import { INPUT_METHOD } from '../analytics/types/enums';
import { openTypeAheadAtCursor, openTypeAhead } from './transforms/open-typeahead-at-cursor';
import { closeTypeAhead } from './transforms/close-type-ahead';
import { updateQuery } from './commands/update-query';
import { insertTypeAheadItem } from './commands/insert-type-ahead-item';

const open = ({
  editorView
}) => itemType => inputMethod => {
  const {
    state
  } = editorView;
  const handler = findHandler(itemType, state);

  if (!handler) {
    return false;
  }

  const {
    tr
  } = state;
  openTypeAheadAtCursor({
    triggerHandler: handler,
    inputMethod
  })(tr);
  editorView.dispatch(tr);
  return true;
};

const defaultCloseOptions = {
  insertCurrentQueryAsRawText: false
};

const close = ({
  editorView
}) => (options = defaultCloseOptions) => {
  const {
    state
  } = editorView;
  const currentQuery = getTypeAheadQuery(editorView.state);
  let tr = state.tr;

  if (options.attachCommand) {
    const fakeDispatch = customTr => {
      tr = customTr;
    };

    options.attachCommand(state, fakeDispatch);
  }

  closeTypeAhead(tr);

  if (options.insertCurrentQueryAsRawText && currentQuery && currentQuery.length > 0) {
    const handler = getTypeAheadHandler(state);
    const text = handler.trigger.concat(currentQuery);
    tr.replaceSelectionWith(state.schema.text(text));
  }

  editorView.dispatch(tr);

  if (!editorView.hasFocus()) {
    editorView.focus();
  }

  return true;
};

const search = ({
  editorView
}) => itemType => (query = '') => {
  const {
    state
  } = editorView;
  const handler = findHandler(itemType, state);

  if (!handler) {
    throw new Error(`Handler not found, did you load the ${itemType} plugin properly`);
  }

  open({
    editorView
  })(itemType)(INPUT_METHOD.KEYBOARD);
  updateQuery(query)(editorView.state, editorView.dispatch);
  const lastQuery = {
    current: query
  };
  const last = handler.getItems({
    query,
    editorState: state
  }).then(items => {
    if (!handler.forceSelect) {
      return items;
    }

    const forceSelectedItem = handler.forceSelect({
      items,
      query,
      editorState: state
    });

    if (!forceSelectedItem) {
      return items;
    }

    insertTypeAheadItem(editorView)({
      handler,
      item: forceSelectedItem,
      query,
      mode: SelectItemMode.SELECTED,
      sourceListItem: items
    });
  });
  const results = {
    last
  };
  return {
    type: appendValue => {
      if (!appendValue) {
        return;
      }

      lastQuery.current += appendValue;
      updateQuery(lastQuery.current)(editorView.state, editorView.dispatch);
      const promise = handler.getItems({
        query: lastQuery.current,
        editorState: state
      });
      results.last = promise;
      return promise;
    },
    result: () => results.last,
    close: close({
      editorView
    }),
    insert: ({
      index,
      mode
    }) => {
      return results.last.then(result => {
        const item = result ? result[index] : null;

        if (result && item) {
          insertTypeAheadItem(editorView)({
            handler,
            item,
            query,
            mode: mode || SelectItemMode.SELECTED,
            sourceListItem: result
          });
        }
      });
    }
  };
};

const insertItem = ({
  editorView
}) => itemType => ({
  contentItem,
  query,
  sourceListItem
}) => {
  const {
    state
  } = editorView;
  const handler = findHandler(itemType, state);

  if (!handler) {
    return false;
  }

  insertTypeAheadItem(editorView)({
    handler,
    item: contentItem,
    mode: SelectItemMode.SELECTED,
    query,
    sourceListItem
  });
  return true;
};

const isOpen = ({
  editorView
}) => () => {
  if (!isTypeAheadOpen(editorView.state)) {
    return false;
  }

  const handler = getTypeAheadHandler(editorView.state);

  if (!handler) {
    return false;
  }

  return handler;
};

const currentQuery = ({
  editorView
}) => () => {
  return getTypeAheadQuery(editorView.state);
};

const find = ({
  editorView
}) => trigger => {
  const {
    state: editorState
  } = editorView;
  const handler = findHandlerByTrigger({
    trigger,
    editorState
  });

  if (!handler) {
    return null;
  }

  return handler;
}; // This is an internal tool to be used inside of others Editor Plugins
// We shouldn't public export this method.


export const createInternalTypeAheadTools = editorView => {
  const props = {
    editorView
  };
  return {
    findTypeAheadHandler: find(props),
    openTypeAheadHandler: openTypeAhead
  };
};
export const createTypeAheadTools = editorView => {
  const props = {
    editorView
  };
  return {
    isOpen: isOpen(props),
    currentQuery: currentQuery(props),
    close: close(props),
    openMention: open(props)(TypeAheadAvailableNodes.MENTION),
    searchMention: search(props)(TypeAheadAvailableNodes.MENTION),
    openQuickInsert: open(props)(TypeAheadAvailableNodes.QUICK_INSERT),
    searchQuickInsert: search(props)(TypeAheadAvailableNodes.QUICK_INSERT),
    openEmoji: open(props)(TypeAheadAvailableNodes.EMOJI),
    searchEmoji: search(props)(TypeAheadAvailableNodes.EMOJI),
    insertItemMention: insertItem(props)(TypeAheadAvailableNodes.MENTION),
    insertItemEmoji: insertItem(props)(TypeAheadAvailableNodes.EMOJI),
    insertItemQuickInsert: insertItem(props)(TypeAheadAvailableNodes.QUICK_INSERT)
  };
};