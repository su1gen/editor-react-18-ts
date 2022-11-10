import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { BlockType } from '../types';
export declare type BlockTypeState = {
    currentBlockType: BlockType;
    blockTypesDisabled: boolean;
    availableBlockTypes: BlockType[];
    availableWrapperBlockTypes: BlockType[];
};
export declare const pluginKey: PluginKey<BlockTypeState, any>;
export declare const createPlugin: (dispatch: (eventName: string | PluginKey, data: any) => void, lastNodeMustBeParagraph?: boolean | undefined) => SafePlugin<any, any>;
