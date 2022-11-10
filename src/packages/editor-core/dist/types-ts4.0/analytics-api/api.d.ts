import type { EditorView } from 'prosemirror-view';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
declare type Props = {
    getEditorView: () => EditorView | undefined | null;
    getCreateUIAnalyticsEvent: () => CreateUIAnalyticsEvent | undefined | null;
};
export declare const createEditorAnalyticsAPI: ({ getEditorView, getCreateUIAnalyticsEvent, }: Props) => EditorAnalyticsAPI;
export {};
