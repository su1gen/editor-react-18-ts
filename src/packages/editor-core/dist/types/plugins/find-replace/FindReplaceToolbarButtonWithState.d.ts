import React from 'react';
import { EditorView } from 'prosemirror-view';
import { DispatchAnalyticsEvent } from '../analytics';
export declare type FindReplaceToolbarButtonWithStateProps = {
    popupsBoundariesElement?: HTMLElement;
    popupsMountPoint?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    isToolbarReducedSpacing?: boolean;
    editorView: EditorView;
    containerElement: HTMLElement | null;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    takeFullWidth?: boolean;
};
declare const FindReplaceToolbarButtonWithState: React.FunctionComponent<FindReplaceToolbarButtonWithStateProps>;
export default FindReplaceToolbarButtonWithState;
