import { PluginKey } from 'prosemirror-state';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Dispatch } from '../../../event-dispatcher';
export interface IndentationButtons {
    indentDisabled: boolean;
    outdentDisabled: boolean;
    node: null | 'paragraph_heading' | 'list' | 'taskList';
}
export declare const pluginKey: PluginKey<IndentationButtons, any>;
export declare const createPlugin: ({ dispatch, showIndentationButtons, allowHeadingAndParagraphIndentation, }: {
    dispatch: Dispatch;
    showIndentationButtons: boolean;
    allowHeadingAndParagraphIndentation: boolean;
}) => SafePlugin<any, any>;
