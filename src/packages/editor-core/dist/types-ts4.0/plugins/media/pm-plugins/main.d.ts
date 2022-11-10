import { Node as PMNode, Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MediaClientConfig } from '@atlaskit/media-core';
import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import type { ContextIdentifierProvider, MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { Dispatch } from '../../../event-dispatcher';
import { ProsemirrorGetPosHandler } from '../../../nodeviews';
import { MediaPluginOptions } from '../media-plugin-options';
import { MediaOptions, MediaState, MediaStateStatus } from '../types';
import PickerFacade, { MediaStateEventSubscriber } from '../picker-facade';
import { MediaNodeWithPosHandler, MediaPluginState } from './types';
import { IntlShape } from 'react-intl-next';
export type { MediaState, MediaProvider, MediaStateStatus };
export { stateKey } from './plugin-key';
export declare class MediaPluginStateImplementation implements MediaPluginState {
    allowsUploads: boolean;
    mediaClientConfig?: MediaClientConfig;
    uploadMediaClientConfig?: MediaClientConfig;
    ignoreLinks: boolean;
    waitForMediaUpload: boolean;
    allUploadsFinished: boolean;
    showDropzone: boolean;
    isFullscreen: boolean;
    element?: HTMLElement;
    layout: MediaSingleLayout;
    mediaNodes: MediaNodeWithPosHandler[];
    mediaGroupNodes: Record<string, any>;
    options: MediaPluginOptions;
    mediaProvider?: MediaProvider;
    private view;
    private destroyed;
    private contextIdentifierProvider?;
    private errorReporter;
    private customPicker?;
    private removeOnCloseListener;
    private openMediaPickerBrowser?;
    private onPopupToggleCallback;
    private nodeCount;
    private taskManager;
    pickers: PickerFacade[];
    pickerPromises: Array<Promise<PickerFacade>>;
    editingMediaSinglePos?: number;
    showEditingDialog?: boolean;
    mediaOptions?: MediaOptions;
    dispatch?: Dispatch;
    constructor(state: EditorState, options: MediaPluginOptions, mediaOptions?: MediaOptions, dispatch?: Dispatch);
    onContextIdentifierProvider: (_name: string, provider?: Promise<ContextIdentifierProvider> | undefined) => Promise<void>;
    setMediaProvider: (mediaProvider?: Promise<MediaProvider> | undefined) => Promise<void>;
    getMediaOptions: () => MediaPluginOptions;
    updateElement(): void;
    private isMediaSchemaNode;
    private getDomElement;
    /**
     * we insert a new file by inserting a initial state for that file.
     *
     * called when we insert a new file via the picker (connected via pickerfacade)
     */
    insertFile: (mediaState: MediaState, onMediaStateChanged: MediaStateEventSubscriber, pickerType?: string | undefined) => void;
    addPendingTask: (task: Promise<any>) => void;
    splitMediaGroup: () => boolean;
    onPopupPickerClose: () => void;
    showMediaPicker: () => void;
    setBrowseFn: (browseFn: () => void) => void;
    onPopupToggle: (onPopupToggleCallback: (isOpen: boolean) => void) => void;
    /**
     * Returns a promise that is resolved after all pending operations have been finished.
     * An optional timeout will cause the promise to reject if the operation takes too long
     *
     * NOTE: The promise will resolve even if some of the media have failed to process.
     */
    waitForPendingTasks: (timeout?: number | undefined, lastTask?: Promise<MediaState | null> | undefined) => Promise<MediaState | null>;
    setView(view: EditorView): void;
    /**
     * Called from React UI Component when user clicks on "Delete" icon
     * inside of it
     */
    handleMediaNodeRemoval: (node: PMNode | undefined, getPos: ProsemirrorGetPosHandler) => void;
    trackMediaNodeAddition: (node: PMNode) => void;
    trackMediaNodeRemoval: (node: PMNode) => void;
    /**
     * Called from React UI Component on componentDidMount
     */
    handleMediaNodeMount: (node: PMNode, getPos: ProsemirrorGetPosHandler) => void;
    /**
     * Called from React UI Component on componentWillUnmount and UNSAFE_componentWillReceiveProps
     * when React component's underlying node property is replaced with a new node
     */
    handleMediaNodeUnmount: (oldNode: PMNode) => void;
    handleMediaGroupUpdate: (oldNodes: PMNode[], newNodes: PMNode[]) => void;
    destroy(): void;
    findMediaNode: (id: string) => MediaNodeWithPosHandler | null;
    private destroyAllPickers;
    private destroyPickers;
    private initPickers;
    private getInputMethod;
    updateMediaNodeAttrs: (id: string, attrs: object, isMediaSingle: boolean) => boolean | undefined;
    private collectionFromProvider;
    private handleMediaState;
    removeNodeById: (state: MediaState) => void;
    removeSelectedMediaContainer: () => boolean;
    selectedMediaContainerNode: () => PMNode | undefined;
    handleDrag: (dragState: 'enter' | 'leave') => void;
    updateAndDispatch(props: Partial<Pick<this, 'allowsUploads' | 'allUploadsFinished' | 'isFullscreen'>>): void;
}
export declare const getMediaPluginState: (state: EditorState) => MediaPluginState;
export declare const createPlugin: (_schema: Schema, options: MediaPluginOptions, reactContext: () => {}, getIntl: () => IntlShape, dispatch?: Dispatch<any> | undefined, mediaOptions?: MediaOptions | undefined) => SafePlugin<any, any>;
