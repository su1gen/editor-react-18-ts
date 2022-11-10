import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../utils/plugin-state-factory';
import reducer from './reducer';
export const mobileDimensionsPluginKey = new PluginKey('mobileDimensions');
export const {
  createPluginState,
  getPluginState,
  createCommand
} = pluginFactory(mobileDimensionsPluginKey, reducer);