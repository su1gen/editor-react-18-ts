import { Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { IntlShape } from 'react-intl-next';
import type { CreateTypeAheadDecorations, RemoveTypeAheadDecorations, PopupMountPointReference } from '../types';
declare type FactoryProps = {
    intl: IntlShape;
    popupMountRef: PopupMountPointReference;
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
};
declare type FactoryReturn = {
    createDecorations: CreateTypeAheadDecorations;
    removeDecorations: RemoveTypeAheadDecorations;
};
export declare const factoryDecorations: ({ intl, popupMountRef, createAnalyticsEvent, }: FactoryProps) => FactoryReturn;
export declare const isSelectionInsideTypeAhead: ({ decorationSet, selection, }: {
    decorationSet?: DecorationSet<any> | undefined;
    selection: Selection;
}) => boolean;
export declare const findDecorationElement: ({ selection, decorationSet, }: {
    selection: Selection;
    decorationSet?: DecorationSet<any> | undefined;
}) => HTMLElement | null;
export {};
