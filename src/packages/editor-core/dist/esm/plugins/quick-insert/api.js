import { pluginKey as quickInsertPluginKey } from './plugin-key';
import { searchQuickInsertItems } from './search';

var getItems = function getItems(editorView) {
  return function (query, options) {
    var pluginState = quickInsertPluginKey.getState(editorView.state);

    if (!pluginState) {
      return [];
    }

    return searchQuickInsertItems(pluginState, options)(query);
  };
};

export var createQuickInsertTools = function createQuickInsertTools(editorView) {
  return {
    getItems: getItems(editorView)
  };
};