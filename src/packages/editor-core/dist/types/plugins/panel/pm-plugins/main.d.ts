import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { PanelPluginOptions } from '../types';
import { Dispatch } from '../../../event-dispatcher';
export declare type PanelOptions = {
    color?: string;
    emoji?: string;
    emojiId?: string;
    emojiText?: string;
};
export declare const createPlugin: (dispatch: Dispatch, providerFactory: ProviderFactory, pluginOptions: PanelPluginOptions) => SafePlugin<any, any>;
