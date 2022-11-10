import { Transaction } from 'prosemirror-state';
import { AnalyticsPayload } from '@atlaskit/adf-schema/steps';
export declare const generateUndoRedoInputSoucePayload: (tr: Transaction) => <T extends AnalyticsPayload>(payload: T) => T;
