import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { MarkType } from 'prosemirror-model';
declare type CopyButtonPluginState = {
    copied: boolean;
    markSelection?: {
        start: number;
        end: number;
        markType: MarkType;
    };
};
export declare function copyButtonPlugin(): SafePlugin<CopyButtonPluginState, any>;
export default copyButtonPlugin;
