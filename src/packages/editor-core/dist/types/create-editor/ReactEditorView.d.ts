/// <reference types="cypress" />
import React from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'prosemirror-state';
import { DirectEditorProps, EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { WrappedComponentProps } from 'react-intl-next';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { ErrorReporter } from '@atlaskit/editor-common/utils';
import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import { Transformer } from '@atlaskit/editor-common/types';
import { Dispatch, EventDispatcher } from '../event-dispatcher';
import { AnalyticsEventPayload, DispatchAnalyticsEvent, FULL_WIDTH_MODE } from '../plugins/analytics';
import { EditorAppearance, EditorConfig, EditorReactContext, EditorPlugin, EditorProps } from '../types';
import { PortalProviderAPI } from '../ui/PortalProvider';
import { SEVERITY } from '@atlaskit/editor-common/utils';
import { TransactionTracker } from '../utils/performance/track-transactions';
import { FireAnalyticsCallback } from '../plugins/analytics/fire-analytics-event';
export interface EditorViewProps {
    editorProps: EditorProps;
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
    providerFactory: ProviderFactory;
    portalProviderAPI: PortalProviderAPI;
    allowAnalyticsGASV3?: boolean;
    disabled?: boolean;
    experienceStore?: ExperienceStore;
    render?: (props: {
        editor: JSX.Element;
        view?: EditorView;
        config: EditorConfig;
        eventDispatcher: EventDispatcher;
        transformer?: Transformer<string>;
        dispatchAnalyticsEvent: DispatchAnalyticsEvent;
        editorRef: React.RefObject<HTMLDivElement>;
    }) => JSX.Element;
    onEditorCreated: (instance: {
        view: EditorView;
        config: EditorConfig;
        eventDispatcher: EventDispatcher;
        transformer?: Transformer<string>;
    }) => void;
    onEditorDestroyed: (instance: {
        view: EditorView;
        config: EditorConfig;
        eventDispatcher: EventDispatcher;
        transformer?: Transformer<string>;
    }) => void;
}
export declare function shouldReconfigureState(props: EditorProps, nextProps: EditorProps): boolean;
export declare class ReactEditorView<T = {}> extends React.Component<EditorViewProps & WrappedComponentProps & T, {}, EditorReactContext> {
    view?: EditorView;
    eventDispatcher: EventDispatcher;
    contentTransformer?: Transformer<string>;
    config: EditorConfig;
    editorState: EditorState;
    errorReporter: ErrorReporter;
    dispatch: Dispatch;
    proseMirrorRenderedSeverity?: SEVERITY;
    transactionTracker: TransactionTracker;
    validTransactionCount: number;
    experienceStore?: ExperienceStore;
    editorRef: React.RefObject<HTMLDivElement>;
    static contextTypes: {
        getAtlaskitAnalyticsEventHandlers: PropTypes.Requireable<(...args: any[]) => any>;
    };
    private canDispatchTransactions;
    private focusTimeoutId?;
    private reliabilityInterval?;
    private pluginPerformanceObserver;
    private featureFlags;
    private onPluginObservation;
    get transactionTracking(): import("../types/performance-tracking").TransactionTracking;
    private getPluginNames;
    private countNodes;
    constructor(props: EditorViewProps & WrappedComponentProps & T, context: EditorReactContext);
    UNSAFE_componentWillReceiveProps(nextProps: EditorViewProps): void;
    formatFullWidthAppearance: (appearance: EditorAppearance | undefined) => FULL_WIDTH_MODE;
    resetEditorState: ({ doc, shouldScrollToBottom, }: {
        doc: string;
        shouldScrollToBottom: boolean;
    }) => void;
    blur: () => void;
    reconfigureState: (props: EditorViewProps) => void;
    handleAnalyticsEvent: FireAnalyticsCallback;
    componentDidMount(): void;
    /**
     * Clean up any non-PM resources when the editor is unmounted
     */
    componentWillUnmount(): void;
    private editorPlugins;
    getPlugins(editorProps: EditorProps, prevEditorProps?: EditorProps, createAnalyticsEvent?: CreateUIAnalyticsEvent): EditorPlugin[];
    createEditorState: (options: {
        props: EditorViewProps;
        context: EditorReactContext;
        doc?: string | Object | PMNode<any> | undefined;
        resetting?: boolean | undefined;
        selectionAtStart?: boolean | undefined;
    }) => EditorState<any>;
    private onEditorViewStateUpdated;
    private trackValidTransactions;
    private dispatchTransaction;
    getDirectEditorProps: (state?: EditorState<any> | undefined) => DirectEditorProps;
    private createEditorView;
    handleEditorViewRef: (node: HTMLDivElement) => void;
    dispatchAnalyticsEvent: (payload: AnalyticsEventPayload) => void;
    private editor;
    render(): JSX.Element;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<EditorViewProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<EditorViewProps & WrappedComponentProps<"intl">>;
};
export default _default;
