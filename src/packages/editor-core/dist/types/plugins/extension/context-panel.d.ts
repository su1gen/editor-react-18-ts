/// <reference types="react" />
import { EditorState } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type { ContentNodeWithPos } from 'prosemirror-utils';
export declare const getContextPanel: (allowAutoSave?: boolean | undefined) => (state: EditorState) => JSX.Element | undefined;
export declare function onChangeAction(editorView: EditorView, updatedParameters: object | undefined, oldParameters: object | undefined, nodeWithPos: ContentNodeWithPos, onSaving?: () => void): Promise<void>;
