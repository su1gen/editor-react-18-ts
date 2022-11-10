/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { Modes, SelectedItemProps } from '../../types';
import { EmptyStateHandler } from '../../../../types/empty-state-handler';
export interface Props {
    items: QuickInsertItem[];
    mode: keyof typeof Modes;
    onInsertItem: (item: QuickInsertItem) => void;
    setColumnCount: (columnCount: number) => void;
    setFocusedItemIndex: (index: number) => void;
    emptyStateHandler?: EmptyStateHandler;
    selectedCategory?: string;
    searchTerm?: string;
}
declare type ElementItemType = {
    inlineMode: boolean;
    item: QuickInsertItem;
    onInsertItem: (item: QuickInsertItem) => void;
    selected: boolean;
    focus: boolean;
    setFocusedItemIndex: (index: number) => void;
    index: number;
};
export declare function ElementItem({ inlineMode, selected, item, index, onInsertItem, focus, setFocusedItemIndex, }: ElementItemType): jsx.JSX.Element;
declare const MemoizedElementListWithAnalytics: React.MemoExoticComponent<React.ForwardRefExoticComponent<Pick<Props & SelectedItemProps & WithAnalyticsEventsProps & import("@atlaskit/analytics-next").WithContextProps, "createAnalyticsEvent" | "analyticsContext" | keyof Props | keyof SelectedItemProps> & React.RefAttributes<any>>>;
export default MemoizedElementListWithAnalytics;
