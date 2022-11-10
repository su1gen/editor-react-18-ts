/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import type { IntlShape } from 'react-intl-next';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { Transformer } from '@atlaskit/editor-common/types';
import EditorActions from './actions';
import { EditorProps, ExtensionProvidersProp } from './types/editor-props';
import { EventDispatcher } from './event-dispatcher';
import { FireAnalyticsCallback } from './plugins/analytics';
import { QuickInsertProvider, QuickInsertOptions } from './plugins/quick-insert/types';
export type { AllowedBlockTypes, Command, CommandDispatch, DomAtPos, EditorAppearance, EditorAppearanceComponentProps, EditorConfig, EditorInstance, EditorPlugin, EditorProps, ExtensionProvidersProp, ExtensionConfig, FeedbackInfo, MarkConfig, MessageDescriptor, NodeConfig, NodeViewConfig, PMPlugin, PMPluginCreateConfig, PMPluginFactory, PMPluginFactoryParams, PluginsOptions, ReactComponents, ToolbarUIComponentFactory, ToolbarUiComponentFactoryParams, UIComponentFactory, UiComponentFactoryParams, } from './types';
declare type Context = {
    editorActions?: EditorActions;
    intl: IntlShape;
};
declare type State = {
    extensionProvider?: ExtensionProvider;
    quickInsertProvider?: Promise<QuickInsertProvider>;
};
export default class Editor extends React.Component<EditorProps, State> {
    static defaultProps: EditorProps;
    static propTypes: {
        minHeight: ({ appearance, minHeight }: EditorProps) => Error | null;
    };
    static contextTypes: {
        editorActions: PropTypes.Requireable<object>;
    };
    private providerFactory;
    private editorActions;
    private createAnalyticsEvent?;
    private editorSessionId;
    private experienceStore?;
    private startTime?;
    constructor(props: EditorProps, context: Context);
    componentDidMount(): void;
    componentDidUpdate(prevProps: EditorProps): void;
    componentWillUnmount(): void;
    trackEditorActions(editorActions: EditorActions & {
        _contentRetrievalTracking?: {
            getValueTracked: boolean;
            samplingCounters: {
                success: number;
                failure: number;
            };
        };
    }, props: EditorProps): EditorActions<any> & {
        _contentRetrievalTracking?: {
            getValueTracked: boolean;
            samplingCounters: {
                success: number;
                failure: number;
            };
        } | undefined;
    };
    prepareExtensionProvider: import("memoize-one").MemoizedFn<(extensionProviders?: ExtensionProvidersProp | undefined) => ExtensionProvider<any> | undefined>;
    prepareQuickInsertProvider: (extensionProvider?: ExtensionProvider<any> | undefined, quickInsert?: QuickInsertOptions | undefined) => Promise<QuickInsertProvider> | undefined;
    onEditorCreated(instance: {
        view: EditorView;
        eventDispatcher: EventDispatcher;
        transformer?: Transformer<string>;
    }): void;
    private sendDurationAnalytics;
    private deprecationWarnings;
    onEditorDestroyed(_instance: {
        view: EditorView;
        transformer?: Transformer<string>;
    }): void;
    private registerEditorForActions;
    private unregisterEditorFromActions;
    private handleProviders;
    private getBaseFontSize;
    handleSave: (view: EditorView) => void;
    handleAnalyticsEvent: FireAnalyticsCallback;
    render(): jsx.JSX.Element;
}
