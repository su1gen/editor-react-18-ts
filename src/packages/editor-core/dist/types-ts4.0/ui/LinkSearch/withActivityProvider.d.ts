import React from 'react';
import { ActivityProvider } from '@atlaskit/activity-provider';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type { Diff } from '@atlaskit/editor-common/utils';
export interface ExpandedActivityProviderProps {
    providerFactory: ProviderFactory;
}
export interface WithActivityProviderProps {
    activityProvider: ActivityProvider;
}
export default function withActivityProvider<Props>(WrappedComponent: React.ComponentType<Props & WithActivityProviderProps>): {
    new (props: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>): {
        renderNode: (providers: Providers) => JSX.Element;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps, context?: any): {
        renderNode: (providers: Providers) => JSX.Element;
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Diff<Props, WithActivityProviderProps> & ExpandedActivityProviderProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
