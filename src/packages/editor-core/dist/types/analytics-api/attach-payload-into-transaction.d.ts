import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import type { Transaction, EditorState } from 'prosemirror-state';
declare type AttachPayloadIntoTransaction = (props: {
    payload: AnalyticsEventPayload;
    editorState: EditorState;
    tr: Transaction;
    channel: string;
}) => void;
export declare const attachPayloadIntoTransaction: AttachPayloadIntoTransaction;
export {};
