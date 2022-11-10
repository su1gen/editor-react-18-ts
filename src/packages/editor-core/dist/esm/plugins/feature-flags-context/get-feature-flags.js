import { pluginKey } from './plugin-key';
export var getFeatureFlags = function getFeatureFlags(state) {
  return pluginKey.getState(state);
};