import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export declare type StateChangeHandler = (fromPos: number, toPos: number) => any;
export declare class ReactNodeViewState {
    private changeHandlers;
    constructor();
    subscribe(cb: StateChangeHandler): void;
    unsubscribe(cb: StateChangeHandler): void;
    notifyNewSelection(fromPos: number, toPos: number): void;
}
export declare const stateKey: PluginKey<ReactNodeViewState, any>;
export declare const plugin: SafePlugin<ReactNodeViewState, any>;
declare const plugins: () => SafePlugin<ReactNodeViewState, any>[];
export default plugins;
