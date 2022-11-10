import { PluginKey } from 'prosemirror-state';
export var pluginKey = new PluginKey('customAutoformatPlugin');
export var getPluginState = function getPluginState(editorState) {
  return pluginKey.getState(editorState);
};
export var autoformatAction = function autoformatAction(tr, action) {
  return tr.setMeta(pluginKey, action);
};