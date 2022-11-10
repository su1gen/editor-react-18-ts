import { ReadonlyTransaction } from 'prosemirror-state';
import { InsertTypeAheadStep } from '@atlaskit/adf-schema/steps';
import { CreateTypeAheadDecorations, PopupMountPointReference, RemoveTypeAheadDecorations, TypeAheadHandler, TypeAheadPluginState } from '../types';
export declare type ReducerOptions = {
    popupMountRef: PopupMountPointReference;
    createDecorations: CreateTypeAheadDecorations;
    removeDecorations: RemoveTypeAheadDecorations;
    typeAheadHandlers: Array<TypeAheadHandler>;
};
export declare const createReducer: ({ typeAheadHandlers, removeDecorations, createDecorations, }: ReducerOptions) => (tr: ReadonlyTransaction, currentPluginState: TypeAheadPluginState, typeAheadStepOverride: InsertTypeAheadStep | null) => TypeAheadPluginState;
