import { ReactElement, RefObject } from 'react';
import { Node, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../actions';
import type { ExtensionHandlers, ExtensionProvider } from '@atlaskit/editor-common/extensions';
import type { ContextIdentifierProvider, SearchProvider, Providers } from '@atlaskit/editor-common/provider-factory';
import { Transformer } from '@atlaskit/editor-common/types';
import type { ErrorReportingHandler } from '@atlaskit/editor-common/utils';
import { ActivityProvider } from '@atlaskit/activity-provider';
import { MentionProvider } from '@atlaskit/mention/resource';
import { TaskDecisionProvider } from '@atlaskit/task-decision';
import { PluginConfig as TablesPluginConfig } from '@atlaskit/editor-plugin-table/types';
import { TextColorPluginConfig } from '../plugins/text-color/pm-plugins/main';
import { MediaOptions, MediaState } from '../plugins/media/types';
import { CollabEditOptions } from '../plugins/collab-edit/types';
import { CardOptions } from '@atlaskit/editor-common/card';
import { QuickInsertOptions } from '../plugins/quick-insert/types';
import { AnnotationProviders } from '../plugins/annotation/types';
import { TextFormattingOptions } from '../plugins/text-formatting/types';
import { PlaceholderTextOptions } from '../plugins/placeholder-text/types';
import { BlockTypePluginOptions } from '../plugins/block-type/types';
import { CodeBlockOptions } from '../plugins/code-block/types';
import { LayoutPluginOptions } from '../plugins/layout/types';
import { FindReplaceOptions } from '../plugins/find-replace/types';
import { ExtensionConfig } from './extension-config';
import { EditorAppearance } from './editor-appearance';
import { MenuItem } from '../ui/DropdownMenu/types';
import { EditorOnChangeHandler } from './editor-onchange';
import { PerformanceTracking } from './performance-tracking';
import { PanelPluginConfig } from './../plugins/panel/types';
import { EditorPlugin } from './editor-plugin';
import { MentionPluginConfig } from './../plugins/mentions/types';
import { EmptyStateHandler } from './empty-state-handler';
import { LinkingOptions } from '../plugins/hyperlink/types';
export declare type ReactComponents = ReactElement<any> | ReactElement<any>[];
declare type ExtensionProviders = (ExtensionProvider | Promise<ExtensionProvider>)[];
declare type ExtensionProvidersWithEditorAction = (editorActions?: EditorActions) => ExtensionProviders;
export declare type ExtensionProvidersProp = ExtensionProviders | ExtensionProvidersWithEditorAction;
export declare type FeedbackInfo = {
    product?: string;
    packageVersion?: string;
    packageName?: string;
    labels?: Array<string>;
    sessionId?: string;
    contentId?: string;
    tabId?: string;
};
export declare type BeforeAndAfterToolbarComponents = {
    before: ReactComponents;
    after: ReactComponents;
};
export declare type PrimaryToolbarComponents = BeforeAndAfterToolbarComponents | ReactComponents;
export interface EditorProps {
    appearance?: EditorAppearance;
    contentComponents?: ReactComponents;
    primaryToolbarComponents?: PrimaryToolbarComponents;
    primaryToolbarIconBefore?: ReactElement;
    secondaryToolbarComponents?: ReactComponents;
    allowAnalyticsGASV3?: boolean;
    allowBlockType?: BlockTypePluginOptions['allowBlockType'];
    allowTasksAndDecisions?: boolean;
    allowBreakout?: boolean;
    allowRule?: boolean;
    allowTextColor?: boolean | TextColorPluginConfig;
    allowTables?: boolean | TablesPluginConfig;
    allowHelpDialog?: boolean;
    feedbackInfo?: FeedbackInfo;
    allowJiraIssue?: boolean;
    allowPanel?: boolean | PanelPluginConfig;
    allowExtension?: boolean | ExtensionConfig;
    allowConfluenceInlineComment?: boolean;
    allowTemplatePlaceholders?: boolean | PlaceholderTextOptions;
    allowDate?: boolean;
    allowLayouts?: boolean | LayoutPluginOptions;
    allowStatus?: boolean | {
        menuDisabled: boolean;
    };
    allowTextAlignment?: boolean;
    allowIndentation?: boolean;
    /**
     * This enables new insertion behaviour only for horizontal rule and media single in certain conditions.
     * The idea of this new behaviour is to have a consistent outcome regardless of the insertion method.
     **/
    allowNewInsertionBehaviour?: boolean;
    /**
     * Set this to false to opt out of the default behaviour of auto scrolling into view
     * whenever the document is changed
     */
    autoScrollIntoView?: boolean;
    allowFindReplace?: boolean | FindReplaceOptions;
    persistScrollGutter?: boolean;
    quickInsert?: QuickInsertOptions;
    /** @deprecated Use smartLinks instead. */
    UNSAFE_cards?: CardOptions;
    /** @deprecated Use linking instead. */
    smartLinks?: CardOptions;
    /**
     *  Configure and extend editor linking behaviour
     */
    linking?: LinkingOptions;
    allowExpand?: boolean | {
        allowInsertion?: boolean;
        allowInteractiveExpand?: boolean;
    };
    saveOnEnter?: boolean;
    shouldFocus?: boolean;
    disabled?: boolean;
    contextPanel?: ReactComponents;
    errorReporterHandler?: ErrorReportingHandler;
    uploadErrorHandler?: (state: MediaState) => void;
    activityProvider?: Promise<ActivityProvider>;
    searchProvider?: Promise<SearchProvider>;
    annotationProviders?: AnnotationProviders;
    collabEditProvider?: Providers['collabEditProvider'];
    presenceProvider?: Promise<any>;
    emojiProvider?: Providers['emojiProvider'];
    taskDecisionProvider?: Promise<TaskDecisionProvider>;
    allowNestedTasks?: boolean;
    contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
    legacyImageUploadProvider?: Providers['imageUploadProvider'];
    mentionProvider?: Promise<MentionProvider>;
    mention?: MentionPluginConfig;
    autoformattingProvider?: Providers['autoformattingProvider'];
    macroProvider?: Providers['macroProvider'];
    waitForMediaUpload?: boolean;
    contentTransformerProvider?: (schema: Schema) => Transformer<string>;
    media?: MediaOptions;
    collabEdit?: CollabEditOptions;
    textFormatting?: TextFormattingOptions;
    maxHeight?: number;
    minHeight?: number;
    maxContentSize?: number;
    placeholder?: string;
    placeholderHints?: string[];
    placeholderBracketHint?: string;
    allowKeyboardAccessibleDatepicker?: boolean;
    defaultValue?: Node | string | Object;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    insertMenuItems?: MenuItem[];
    editorActions?: EditorActions;
    onEditorReady?: (editorActions: EditorActions) => void;
    onDestroy?: () => void;
    onChange?: EditorOnChangeHandler;
    onSave?: (editorView: EditorView) => void;
    onCancel?: (editorView: EditorView) => void;
    extensionHandlers?: ExtensionHandlers;
    sanitizePrivateContent?: boolean;
    /**
     * flag to indicate display name instead of nick name should be inserted for mentions
     * default: false, which inserts the nick name
     * @deprecated Use mention.mentionInsertDisplayName instead
     */
    mentionInsertDisplayName?: boolean;
    /**
     * @description The nth keystroke after which an input time taken event is sent, 0 to disable it
     * @default 100
     * @deprecated Use performanceTracking.inputSampling instead https://product-fabric.atlassian.net/browse/ED-10260
     */
    inputSamplingLimit?: number;
    extensionProviders?: ExtensionProvidersProp;
    UNSAFE_useAnalyticsContext?: boolean;
    /**
     * @description Control performance metric measurements and tracking
     */
    performanceTracking?: PerformanceTracking;
    elementBrowser?: {
        showModal?: boolean;
        replacePlusMenu?: boolean;
        helpUrl?: string;
        emptyStateHandler?: EmptyStateHandler;
    };
    codeBlock?: CodeBlockOptions;
    allowUndoRedoButtons?: boolean;
    /**
     * @default undefined
     * @description Enables valid transaction events to be tracked in analytics (at a sampled rate)
     */
    trackValidTransactions?: {
        samplingRate: number;
    } | boolean;
    /**
     * @default undefined
     * @description
     * Enables the sticky toolbar in the comment/standard editor.
     * If a boolean is specified and it's `true`, the sticky toolbar will be enabled, sticking to the top of the scroll parent.
     * Instead a reference can be specified to an existing sticky toolbar on the page that the editor toolbar should stay below (experimental).
     */
    useStickyToolbar?: boolean | RefObject<HTMLElement>;
    /**
     * @default undefined
     * @description
     * Short lived feature flags for experiments and gradual rollouts
     * Flags are expected to follow these rules or they are filtered out
     *
     * 1. cased in kebab-case (match [a-z-])
     * 2. have boolean values
     *
     * @example
     * ```tsx
     * (<Editor featureFlags={{ 'my-feature': true }} />);
     * getFeatureFlags()?.myFeature === true;
     * ```
     *
     * @example
     * ```tsx
     * (<Editor featureFlags={{ 'my-feature': 'thing' }} />);
     * getFeatureFlags()?.myFeature === undefined;
     * ```
     *
     * @example
     * ```tsx
     * (<Editor featureFlags={{ 'product.my-feature': false }} />);
     * getFeatureFlags()?.myFeature === undefined;
     * getFeatureFlags()?.productMyFeature === undefined;
     * ```
     */
    featureFlags?: {
        [featureFlag: string]: string | boolean;
    };
    /**
     * Enable support for the "fragment" mark.
     * Refer to ADF Change proposal #60 for more details.
     */
    allowFragmentMark?: boolean;
    /**
     * @deprecated Do not use outside of Editor team.
     * This has subtle side effects - you __WILL__ break functionality without implementer knowledge of editor-core internals
     */
    dangerouslyAppendPlugins?: {
        /**
         * @deprecated Do not use outside of Editor team.
         */
        __plugins: EditorPlugin[];
    };
}
export {};
