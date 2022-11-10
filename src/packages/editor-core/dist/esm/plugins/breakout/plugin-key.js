import { PluginKey } from 'prosemirror-state';
export var pluginKey = new PluginKey('breakoutPlugin');
export var getPluginState = function getPluginState(state) {
  return pluginKey.getState(state);
};