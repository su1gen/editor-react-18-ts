import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../utils/plugin-state-factory';
import reducer from './reducer';
export var mobileDimensionsPluginKey = new PluginKey('mobileDimensions');

var _pluginFactory = pluginFactory(mobileDimensionsPluginKey, reducer),
    createPluginState = _pluginFactory.createPluginState,
    getPluginState = _pluginFactory.getPluginState,
    createCommand = _pluginFactory.createCommand;

export { createPluginState, getPluginState, createCommand };