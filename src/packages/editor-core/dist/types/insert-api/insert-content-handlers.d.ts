import type { Transaction } from 'prosemirror-state';
import type { EditorPlugin } from '../types/editor-plugin';
import type { InsertNodeConfig, CreateNodeHandler } from './types';
export declare const findCreateNodeHandler: ({ node, editorPlugins, }: Pick<InsertContentProps, 'node' | 'editorPlugins'>) => CreateNodeHandler | null;
declare type InsertContentProps = {
    editorPlugins: EditorPlugin[];
} & InsertNodeConfig;
export declare const handleInsertContent: ({ node, options, editorPlugins, }: InsertContentProps) => (tr: Transaction) => boolean;
export {};
