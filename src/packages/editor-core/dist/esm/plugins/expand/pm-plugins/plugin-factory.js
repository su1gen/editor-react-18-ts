import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import reducer from '../reducer';
export var pluginKey = new PluginKey('expandPlugin');

var _pluginFactory = pluginFactory(pluginKey, reducer),
    createPluginState = _pluginFactory.createPluginState,
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState;

export { createPluginState, createCommand, getPluginState };