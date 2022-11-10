import { mentionPluginKey } from './key';
export function getMentionPluginState(state) {
  return mentionPluginKey.getState(state);
}