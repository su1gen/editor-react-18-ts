import React, { ComponentType } from 'react';
import { EditorView } from 'prosemirror-view';
export interface WithEditorViewInternalProps {
    editorView?: EditorView | undefined;
}
export declare const WithEditorView: <P extends WithEditorViewInternalProps>(WrappedComponent: React.ComponentType<P>) => React.ComponentType<Omit<P, "editorView">>;
