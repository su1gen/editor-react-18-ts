import { PluginKey } from 'prosemirror-state';
import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
export type { SelectionPluginState } from '@atlaskit/editor-common/selection';
export declare const selectionPluginKey: PluginKey<any, any>;
export { RelativeSelectionPos };
export declare enum SelectionDirection {
    Before = -1,
    After = 1
}
export interface LongPressSelectionPluginOptions {
    useLongPressSelection?: boolean;
}
export interface SelectionPluginOptions extends LongPressSelectionPluginOptions {
}
