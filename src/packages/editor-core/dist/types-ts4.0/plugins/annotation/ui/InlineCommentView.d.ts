/// <reference types="react" />
import { EditorView } from 'prosemirror-view';
import { AnnotationProviders } from '../types';
import { DispatchAnalyticsEvent } from '../../analytics/types';
interface InlineCommentViewProps {
    providers: AnnotationProviders;
    editorView: EditorView;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}
export declare function InlineCommentView({ providers, editorView, dispatchAnalyticsEvent, }: InlineCommentViewProps): JSX.Element | null;
export {};
