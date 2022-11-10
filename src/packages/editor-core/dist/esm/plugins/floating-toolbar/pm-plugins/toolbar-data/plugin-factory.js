import { pluginFactory } from '../../../../utils/plugin-state-factory';
import { pluginKey } from './plugin-key';
import { reducer } from './reducer';

var _pluginFactory = pluginFactory(pluginKey, reducer),
    createPluginState = _pluginFactory.createPluginState,
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState;

export { createPluginState, createCommand, getPluginState };