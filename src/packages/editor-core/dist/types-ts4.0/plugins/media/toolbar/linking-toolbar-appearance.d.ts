/** @jsx jsx */
import React from 'react';
import { IntlShape } from 'react-intl-next';
import { EditorState } from 'prosemirror-state';
import { MediaLinkingState } from '../pm-plugins/linking';
export interface LinkingToolbarProps {
    editorState: EditorState;
    intl: IntlShape;
    mediaLinkingState: MediaLinkingState;
    onAddLink: React.MouseEventHandler;
    onEditLink: React.MouseEventHandler;
    onOpenLink: React.MouseEventHandler;
}
export declare const LinkToolbarAppearance: React.FC<LinkingToolbarProps>;
