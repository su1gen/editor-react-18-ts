import { EditorView } from 'prosemirror-view';
import React from 'react';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import type { UserBrowserExtensionResults } from '@atlaskit/editor-common/utils';
import { FeatureFlags } from '../types/feature-flags';
export declare type ErrorBoundaryProps = {
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
    contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
    editorView?: EditorView;
    rethrow?: boolean;
    children: React.ReactNode;
};
export declare type ErrorBoundaryState = {
    error?: Error;
};
declare type AnalyticsErrorBoundaryErrorInfo = {
    componentStack: string;
};
export declare class ErrorBoundaryWithEditorView extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    browserExtensions?: UserBrowserExtensionResults;
    experienceStore?: ExperienceStore;
    static defaultProps: {
        rethrow: boolean;
    };
    state: {
        error: undefined;
    };
    private getFeatureFlags;
    get featureFlags(): FeatureFlags;
    constructor(props: ErrorBoundaryProps);
    private sendErrorData;
    private getProductName;
    private fireAnalyticsEvent;
    private getExperienceMetadata;
    componentDidCatch(error: Error, errorInfo: AnalyticsErrorBoundaryErrorInfo): void;
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
}
declare const _default: React.ComponentType<Omit<ErrorBoundaryProps, "editorView">>;
export default _default;
