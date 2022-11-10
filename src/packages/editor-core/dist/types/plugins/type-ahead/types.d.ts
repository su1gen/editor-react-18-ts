import type { DecorationSet } from 'prosemirror-view';
import { EditorState, Transaction, ReadonlyTransaction } from 'prosemirror-state';
import type { INPUT_METHOD } from '../analytics/types/enums';
import type { CloseSelectionOptions } from './constants';
import type { UiComponentFactoryParams } from '../../types/ui-components';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadStats, TypeAheadItemRenderProps, TypeAheadInsert, TypeAheadSelectItem, TypeAheadItem, TypeAheadForceSelect, TypeAheadHandler } from '@atlaskit/editor-common/types';
export type { TypeAheadStats, TypeAheadItemRenderProps, TypeAheadInsert, TypeAheadSelectItem, TypeAheadItem, TypeAheadForceSelect, TypeAheadHandler, };
export declare type OnSelectItem = (props: {
    index: number;
    item: TypeAheadItem;
}) => void;
export interface TypeAheadStatsSerializable extends TypeAheadStats {
    serialize: () => TypeAheadStats;
}
export interface TypeAheadStatsModifier extends TypeAheadStatsSerializable {
    increaseArrowUp: () => void;
    increaseArrowDown: () => void;
}
export interface TypeAheadStatsMobileModifier extends TypeAheadStatsSerializable {
    resetTime: () => void;
    closeTime: () => void;
}
export declare type TypeAheadPluginState = {
    decorationSet: DecorationSet;
    decorationElement: HTMLElement | null;
    typeAheadHandlers: Array<TypeAheadHandler>;
    query: string;
    items: Array<TypeAheadItem>;
    triggerHandler?: TypeAheadHandler;
    selectedIndex: number;
    stats: TypeAheadStatsSerializable | null;
    inputMethod: TypeAheadInputMethod | null;
};
export declare type OnInsertSelectedItemProps = {
    mode: SelectItemMode;
    index: number;
    query: string;
};
export declare type OnItemMatchProps = {
    mode: SelectItemMode;
    query: string;
};
export declare type OnInsertSelectedItem = (props: OnInsertSelectedItemProps) => void;
export declare type OnItemMatch = (props: OnItemMatchProps) => boolean;
export declare type OnTextInsertProps = {
    forceFocusOnEditor: boolean;
    setSelectionAt: CloseSelectionOptions;
    text: string;
};
export declare type OnTextInsert = (props: OnTextInsertProps) => void;
export declare type TypeAheadInputMethod = INPUT_METHOD.INSERT_MENU | INPUT_METHOD.KEYBOARD | INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR;
export declare type InsertionTransactionMeta = (editorState: EditorState) => Transaction | false;
declare type PopupMountPoints = Pick<UiComponentFactoryParams, 'popupsMountPoint' | 'popupsBoundariesElement' | 'popupsScrollableElement'>;
export declare type PopupMountPointReference = Record<'current', PopupMountPoints | null>;
export declare type CreateTypeAheadDecorations = (tr: ReadonlyTransaction, options: {
    triggerHandler: TypeAheadHandler;
    inputMethod: TypeAheadInputMethod;
    reopenQuery?: string;
}) => {
    decorationSet: DecorationSet;
    decorationElement: HTMLElement | null;
    stats: TypeAheadStatsSerializable | null;
};
export declare type RemoveTypeAheadDecorations = (decorationSet?: DecorationSet) => boolean;
