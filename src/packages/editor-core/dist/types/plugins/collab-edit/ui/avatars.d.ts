/** @jsx jsx */
import React from 'react';
import { EditorView } from 'prosemirror-view';
import { ReadOnlyParticipants } from '../participants';
export interface AvatarsProps {
    sessionId?: string;
    participants: ReadOnlyParticipants;
    editorView?: EditorView;
}
export declare const Avatars: React.FC<AvatarsProps>;
