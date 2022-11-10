import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MediaState } from '../types';
import { InputMethodInsertMedia } from '../../analytics';
export interface Range {
    start: number;
    end: number;
}
export declare const canInsertMediaInline: (state: EditorState) => boolean;
/**
 * Create a new media inline to insert the new media.
 * @param view Editor view
 * @param mediaState Media file to be added to the editor
 * @param collection Collection for the media to be added
 */
export declare const insertMediaInlineNode: (view: EditorView, mediaState: MediaState, collection: string, inputMethod?: InputMethodInsertMedia | undefined) => boolean;
/**
 * Insert a media into an existing media group
 * or create a new media group to insert the new media.
 * @param view Editor view
 * @param mediaStates Media files to be added to the editor
 * @param collection Collection for the media to be added
 */
export declare const insertMediaGroupNode: (view: EditorView, mediaStates: MediaState[], collection: string, inputMethod?: InputMethodInsertMedia | undefined) => void;
/**
 * Return position of media to be inserted, if it is inside a list
 * @param content Content to be inserted
 * @param state Editor State
 */
export declare const getPosInList: (state: EditorState) => number | undefined;
