import { pluginKey as quickInsertPluginKey } from './plugin-key';
import { searchQuickInsertItems } from './search';

const getItems = editorView => (query, options) => {
  const pluginState = quickInsertPluginKey.getState(editorView.state);

  if (!pluginState) {
    return [];
  }

  return searchQuickInsertItems(pluginState, options)(query);
};

export const createQuickInsertTools = editorView => {
  return {
    getItems: getItems(editorView)
  };
};