import { EditorState } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';
import { CollabEditOptions, CollabParticipant } from './types';
export interface Color {
    solid: string;
    selection: string;
}
export declare const colors: Color[];
export declare const getAvatarColor: (str: string) => {
    index: number;
    color: Color;
};
export declare const findPointers: (id: string, decorations: DecorationSet) => Decoration[];
export declare const createTelepointers: (from: number, to: number, sessionId: string, isSelection: boolean, initial: string) => Decoration<{
    [key: string]: any;
}>[];
export declare const replaceDocument: (doc: any, state: EditorState, version?: number | undefined, options?: CollabEditOptions | undefined, reserveCursor?: boolean | undefined) => import("prosemirror-state").Transaction<any>;
export declare const scrollToCollabCursor: (editorView: EditorView, participants: CollabParticipant[], sessionId: string | undefined, index: number) => void;
export declare const getPositionOfTelepointer: (sessionId: string, decorationSet: DecorationSet) => undefined | number;
