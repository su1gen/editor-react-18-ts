import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginKey } from './plugin-key';
export const createPlugin = ({
  dispatch
}) => {
  return new SafePlugin({
    key: pluginKey
  });
};