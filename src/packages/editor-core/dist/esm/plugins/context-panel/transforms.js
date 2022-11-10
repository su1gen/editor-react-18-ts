import { pluginKey } from './';
export var applyChange = function applyChange(tr) {
  return tr.setMeta(pluginKey, {
    changed: true
  });
};