import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import type { EditorState } from 'prosemirror-state';
import { SELECTION_TYPE, SELECTION_POSITION } from '@atlaskit/editor-common/analytics';
export declare function getSelectionType(state: EditorState): {
    type: SELECTION_TYPE;
    position?: SELECTION_POSITION;
};
export declare function findInsertLocation(state: EditorState): string;
export declare function getStateContext(state: EditorState, payload: AnalyticsEventPayload): AnalyticsEventPayload;
