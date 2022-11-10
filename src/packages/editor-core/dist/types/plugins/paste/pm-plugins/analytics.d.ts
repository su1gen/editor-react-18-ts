import { AnalyticsEventPayload, PasteType, PasteContent } from '../../analytics';
import { EditorView } from 'prosemirror-view';
import { Slice, Fragment } from 'prosemirror-model';
import { Command } from '../../../types';
import { EditorState } from 'prosemirror-state';
declare type PasteContext = {
    type: PasteType;
    asPlain?: boolean;
    /** Has the hyperlink been pasted while text is selected, making the text into a link? */
    hyperlinkPasteOnText?: boolean;
};
export declare function getContent(state: EditorState, slice: Slice): PasteContent;
export declare function createPasteAnalyticsPayload(view: EditorView, event: ClipboardEvent, slice: Slice, pasteContext: PasteContext): AnalyticsEventPayload;
export declare function sendPasteAnalyticsEvent(view: EditorView, event: ClipboardEvent, slice: Slice, pasteContext: PasteContext): void;
export declare function pasteCommandWithAnalytics(view: EditorView, event: ClipboardEvent, slice: Slice, pasteContext: PasteContext): import("../../analytics").HigherOrderCommand;
export declare const handlePasteAsPlainTextWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice) => Command;
export declare const handlePasteIntoTaskAndDecisionWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice, type: PasteType) => Command;
export declare const handlePasteIntoCaptionWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice, type: PasteType) => Command;
export declare const handleCodeBlockWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice, text: string) => Command;
export declare const handleMediaSingleWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice, type: PasteType) => Command;
export declare const handlePastePreservingMarksWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice, type: PasteType) => Command;
export declare const handleMarkdownWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice) => Command;
export declare const handleRichTextWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice) => Command;
export declare const handlePastePanelIntoListWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice) => Command;
export declare const handleExpandWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice) => Command;
export declare const handleSelectedTableWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice) => Command;
export declare const handlePasteLinkOnSelectedTextWithAnalytics: (view: EditorView, event: ClipboardEvent, slice: Slice, type: PasteType) => Command;
export declare const createPasteMeasurePayload: ({ view, duration, content, distortedDuration, }: {
    view: EditorView;
    duration: number;
    content: Array<string>;
    distortedDuration: boolean;
}) => AnalyticsEventPayload;
export declare const getContentNodeTypes: (content: Fragment) => string[];
export {};
