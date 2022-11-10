import { Node } from 'prosemirror-model';
import { EditorActionsOptions, ContextUpdateHandler } from '@atlaskit/editor-common/types';
import { EditorView } from 'prosemirror-view';
import { EventDispatcher } from '../event-dispatcher';
import { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import { Transformer } from '@atlaskit/editor-common/types';
import { ResolvedEditorState } from '@atlaskit/editor-common/collab';
export default class EditorActions<T = any> implements EditorActionsOptions<T> {
    private editorView?;
    private contentTransformer?;
    private contentEncode?;
    private eventDispatcher?;
    private listeners;
    static from<T>(view: EditorView, eventDispatcher: EventDispatcher, transformer?: Transformer<T>): EditorActions<T>;
    _privateGetEditorView(): EditorView | undefined;
    _privateGetEventDispatcher(): EventDispatcher | undefined;
    _privateRegisterEditor(editorView: EditorView, eventDispatcher: EventDispatcher, contentTransformer?: Transformer<T>): void;
    _privateUnregisterEditor(): void;
    _privateSubscribe(cb: ContextUpdateHandler): void;
    _privateUnsubscribe(cb: ContextUpdateHandler): void;
    focus(): boolean;
    blur(): boolean;
    clear(): boolean;
    __temporaryFixForConfigPanel(): Promise<void>;
    getValue(): Promise<import("@atlaskit/editor-json-transformer/types").JSONDocNode | T | undefined>;
    getNodeByLocalId(id: string): Node | undefined;
    getNodeByFragmentLocalId(id: string): Node | undefined;
    /**
     * This method will return the currently selected `Node` if the selection is a `Node`.
     * Otherwise, if the selection is textual or a non-selectable `Node` within another selectable `Node`, the closest selectable parent `Node` will be returned.
     */
    getSelectedNode(): Node | undefined;
    isDocumentEmpty(): boolean;
    replaceDocument(rawValue: any, shouldScrollToBottom?: boolean, 
    /** @deprecated [ED-14158] shouldAddToHistory is not being used in this function */
    shouldAddToHistory?: boolean): boolean;
    replaceSelection(rawValue: Node | Object | string, tryToReplace?: boolean): boolean;
    appendText(text: string): boolean;
    dispatchAnalyticsEvent: (payload: AnalyticsEventPayload) => void;
    /**
     * If editor is using new collab service,
     * we want editor to call the collab provider to
     * retrieve the final acknowledged state of the
     * editor. The final acknowledged editor state
     * refers to the latest state of editor with confirmed
     * steps.
     */
    getResolvedEditorState: () => Promise<ResolvedEditorState | undefined>;
}
