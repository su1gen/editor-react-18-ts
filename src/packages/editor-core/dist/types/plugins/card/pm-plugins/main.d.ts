import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { CardPluginOptions, CardPluginState } from '../types';
import { PMPluginFactoryParams } from '../../../types';
export { pluginKey } from './plugin-key';
export declare const createPlugin: (options: CardPluginOptions) => (pmPluginFactoryParams: PMPluginFactoryParams) => SafePlugin<CardPluginState, any>;
