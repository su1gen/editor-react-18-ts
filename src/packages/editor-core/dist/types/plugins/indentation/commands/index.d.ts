import { Node as PmNode, Schema } from 'prosemirror-model';
import { Command } from '../../../types/command';
import { IndentationInputMethod } from './utils';
export declare const MAX_INDENTATION_LEVEL = 6;
export declare const isIndentationAllowed: (schema: Schema, node: PmNode) => boolean;
export declare const getIndentCommand: (inputMethod?: IndentationInputMethod) => Command;
export declare const getOutdentCommand: (inputMethod?: IndentationInputMethod) => Command;
export declare const removeIndentation: Command;
