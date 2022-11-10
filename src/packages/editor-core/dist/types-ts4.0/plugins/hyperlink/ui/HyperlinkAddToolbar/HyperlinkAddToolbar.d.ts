/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { ActivityProvider } from '@atlaskit/activity-provider';
import type { SearchProvider } from '@atlaskit/editor-common/provider-factory';
import { PureComponent } from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { LinkSearchListItemData } from '../../../../ui/LinkSearch/types';
import { HyperlinkState } from '../../pm-plugins/main';
import { EditorView } from 'prosemirror-view';
import { LinkInputType } from '../../types';
export declare const RECENT_SEARCH_LIST_SIZE = 5;
export declare const messages: {
    displayText: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    clearText: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    clearLink: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    searchLinkAriaDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    searchLinkResults: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    linkAriaLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    };
};
interface BaseProps {
    onSubmit?: (href: string, title: string | undefined, displayText: string | undefined, inputMethod: LinkInputType) => void;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    autoFocus?: boolean;
    activityProvider?: Promise<ActivityProvider>;
    searchProvider?: Promise<SearchProvider>;
    displayUrl?: string;
    pluginState: HyperlinkState;
    view: EditorView;
}
interface DefaultProps {
    displayText: string;
}
export declare type Props = WrappedComponentProps & BaseProps & DefaultProps & WithAnalyticsEventsProps;
declare type HyperlinkLinkAddToolbarProps = WrappedComponentProps & BaseProps & Partial<DefaultProps> & WithAnalyticsEventsProps;
export interface State {
    activityProvider?: ActivityProvider;
    searchProvider?: SearchProvider;
    items: LinkSearchListItemData[];
    selectedIndex: number;
    displayUrl: string;
    isLoading: boolean;
    displayText: string;
}
export declare class HyperlinkLinkAddToolbar extends PureComponent<Props, State> {
    private submitted;
    private urlInputContainer;
    private displayTextInputContainer;
    private wrapperRef;
    private handleClearText;
    private handleClearDisplayText;
    private debouncedQuickSearch;
    private fireCustomAnalytics?;
    private quickSearchQueryVersion;
    private analyticSource;
    constructor(props: Props);
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    private getRecentItems;
    private fireAnalytics;
    private loadInitialLinkSearchResult;
    private quickSearch;
    private updateInput;
    private createClearHandler;
    private handleClickOutside;
    private getScreenReaderText;
    render(): jsx.JSX.Element;
    private isUrlPopulatedWithSelectedItem;
    private handleSelected;
    private handleInsert;
    private handleMouseEnterResultItem;
    private handleMouseLeaveResultItem;
    private handleSubmit;
    private handleClearTextKeyDown;
    private handleKeyDown;
    private updateTextInput;
    private handleCancel;
}
export declare const HyperlinkLinkAddToolbarWithIntl: React.FC<import("react-intl-next").WithIntlProps<HyperlinkLinkAddToolbarProps>> & {
    WrappedComponent: React.ComponentType<HyperlinkLinkAddToolbarProps>;
};
declare const _default: React.ForwardRefExoticComponent<Omit<React.PropsWithChildren<import("react-intl-next").WithIntlProps<HyperlinkLinkAddToolbarProps>>, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>>;
export default _default;
