import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { PMPluginFactoryParams } from '../../../types';
import { DispatchAnalyticsEvent } from '../../analytics/types/dispatch-analytics-event';
import { AnalyticsEventPayload } from '../../../plugins/analytics';
import { ACTION } from '../../analytics/types/enums';
import { DOMSerializer } from 'prosemirror-model';
import type { Schema } from 'prosemirror-model';
export declare const createPlugin: ({ dispatchAnalyticsEvent, schema, }: PMPluginFactoryParams) => SafePlugin<any, any>;
/**
 * Overrides Prosemirror's default clipboardSerializer, in order to fix table row copy/paste bug raised in ED-13003.
 * This allows us to store the original table’s attributes on the new table that the row is wrapped with when it is being copied.
 * e.g. keeping the layout on a row that is copied.
 * We store the default serializer in order to call it after we handle the table row case.
 */
export declare const createClipboardSerializer: (schema: Schema, getEditorView: () => EditorView) => DOMSerializer;
export declare const sendClipboardAnalytics: (view: EditorView, dispatchAnalyticsEvent: DispatchAnalyticsEvent, action: ACTION.CUT | ACTION.COPIED) => boolean;
export declare const getAnalyticsPayload: (state: EditorState, action: ACTION.CUT | ACTION.COPIED) => AnalyticsEventPayload | undefined;
