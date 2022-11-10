import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Command } from '../../../types';
import { INPUT_METHOD } from '../../analytics';
declare type IndentationInputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;
export declare const getUnindentCommand: (inputMethod?: IndentationInputMethod) => Command;
export declare const getIndentCommand: (inputMethod?: IndentationInputMethod) => Command;
export declare function keymapPlugin(schema: Schema, allowNestedTasks?: boolean, consumeTabs?: boolean): SafePlugin | undefined;
export default keymapPlugin;
