/** @jsx jsx */
import React from 'react';
import { EditorView } from 'prosemirror-view';
import { MenuIconItem } from './types';
export declare const SingleToolbarButtons: React.FC<{
    items: MenuIconItem[];
    isReducedSpacing: boolean;
    editorView: EditorView;
}>;
