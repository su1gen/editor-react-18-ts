import { mobileDimensionsPluginKey } from './plugin-factory';
export var getMobileDimensionsPluginState = function getMobileDimensionsPluginState(state) {
  return mobileDimensionsPluginKey.getState(state);
};