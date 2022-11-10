import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginKey } from './plugin-key';
export var createPlugin = function createPlugin(_ref) {
  var dispatch = _ref.dispatch;
  return new SafePlugin({
    key: pluginKey
  });
};