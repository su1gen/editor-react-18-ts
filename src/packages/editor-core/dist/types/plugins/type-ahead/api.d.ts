import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
import type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadHandler, TypeAheadInputMethod } from './types';
import type { Command } from '../../types/command';
declare type CloseOptions = {
    insertCurrentQueryAsRawText: boolean;
    attachCommand?: Command;
};
declare type InsertItemProps = {
    contentItem: TypeAheadItem;
    query: string;
    sourceListItem: TypeAheadItem[];
};
export declare const createInternalTypeAheadTools: (editorView: EditorView) => {
    findTypeAheadHandler: (trigger: string) => TypeAheadHandler | null;
    openTypeAheadHandler: (props: {
        triggerHandler: TypeAheadHandler;
        inputMethod: TypeAheadInputMethod;
        query?: string | undefined;
    }) => (tr: Transaction<any>) => void;
};
export declare const createTypeAheadTools: (editorView: EditorView) => {
    isOpen: () => TypeAheadHandler | false;
    currentQuery: () => string;
    close: (options?: CloseOptions) => boolean;
    openMention: (inputMethod: TypeAheadInputMethod) => boolean;
    searchMention: (query?: string) => {
        type: (appendValue: string) => Promise<TypeAheadItem[]> | undefined;
        result: () => Promise<TypeAheadItem[] | undefined>;
        close: (options?: CloseOptions) => boolean;
        insert: ({ index, mode }: {
            index: number;
            mode?: SelectItemMode | undefined;
        }) => Promise<void>;
    };
    openQuickInsert: (inputMethod: TypeAheadInputMethod) => boolean;
    searchQuickInsert: (query?: string) => {
        type: (appendValue: string) => Promise<TypeAheadItem[]> | undefined;
        result: () => Promise<TypeAheadItem[] | undefined>;
        close: (options?: CloseOptions) => boolean;
        insert: ({ index, mode }: {
            index: number;
            mode?: SelectItemMode | undefined;
        }) => Promise<void>;
    };
    openEmoji: (inputMethod: TypeAheadInputMethod) => boolean;
    searchEmoji: (query?: string) => {
        type: (appendValue: string) => Promise<TypeAheadItem[]> | undefined;
        result: () => Promise<TypeAheadItem[] | undefined>;
        close: (options?: CloseOptions) => boolean;
        insert: ({ index, mode }: {
            index: number;
            mode?: SelectItemMode | undefined;
        }) => Promise<void>;
    };
    insertItemMention: ({ contentItem, query, sourceListItem }: InsertItemProps) => boolean;
    insertItemEmoji: ({ contentItem, query, sourceListItem }: InsertItemProps) => boolean;
    insertItemQuickInsert: ({ contentItem, query, sourceListItem }: InsertItemProps) => boolean;
};
export {};
