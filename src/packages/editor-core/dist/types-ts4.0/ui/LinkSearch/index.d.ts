import React from 'react';
import { WithActivityProviderProps } from './withActivityProvider';
import { RecentSearchProps } from './types';
declare const _default: {
    new (props: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>): {
        renderNode: (providers: import("@atlaskit/editor-common/provider-factory").Providers) => JSX.Element;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps, context?: any): {
        renderNode: (providers: import("@atlaskit/editor-common/provider-factory").Providers) => JSX.Element;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<import("@atlaskit/editor-common/utils").Diff<RecentSearchProps & WithActivityProviderProps, WithActivityProviderProps> & import("./withActivityProvider").ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
export default _default;
