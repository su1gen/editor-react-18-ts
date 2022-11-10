/** @jsx jsx */
import React from 'react';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { Category, Modes } from '../types';
import { EmptyStateHandler } from '../../../types/empty-state-handler';
export declare type StatelessElementBrowserProps = {
    categories?: Category[];
    items: QuickInsertItem[];
    onSearch: (searchTerm: string) => void;
    onSelectCategory: (category: Category) => void;
    onSelectItem?: (item: QuickInsertItem) => void;
    onInsertItem: (item: QuickInsertItem) => void;
    selectedCategory?: string;
    showSearch: boolean;
    showCategories: boolean;
    mode: keyof typeof Modes;
    searchTerm?: string;
    emptyStateHandler?: EmptyStateHandler;
} & WithAnalyticsEventsProps;
declare const MemoizedElementBrowser: React.MemoExoticComponent<React.ForwardRefExoticComponent<Pick<Omit<StatelessElementBrowserProps, keyof WithAnalyticsEventsProps> & React.RefAttributes<any> & import("@atlaskit/analytics-next").WithContextProps, "key" | "mode" | "analyticsContext" | "items" | "emptyStateHandler" | "selectedCategory" | "searchTerm" | "onInsertItem" | "categories" | "onSelectCategory" | "onSearch" | "onSelectItem" | "showCategories" | "showSearch"> & React.RefAttributes<any>>>;
export default MemoizedElementBrowser;
