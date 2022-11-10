import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '../../types';
import { StatusPluginOptions } from './types';
export { pluginKey, pluginKeyName } from './plugin-key';
export type { StatusState, StatusType } from './types';
declare const createPlugin: (pmPluginFactoryParams: PMPluginFactoryParams, options?: StatusPluginOptions | undefined) => SafePlugin<any, any>;
export default createPlugin;
