import { pmHistoryPluginKey } from './pm-history-types';
export var getPmHistoryPlugin = function getPmHistoryPlugin(state) {
  return state.plugins.find(function (plugin) {
    return plugin.key === pmHistoryPluginKey;
  });
};
export var getPmHistoryPluginState = function getPmHistoryPluginState(state) {
  var pmHistoryPlugin = getPmHistoryPlugin(state);

  if (!pmHistoryPlugin) {
    return;
  }

  return pmHistoryPlugin.getState(state);
};