import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorPlugin, EditorProps } from '../types';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import { ScrollGutterPluginOptions } from '../plugins/base/pm-plugins/scroll-gutter';
import { DefaultPresetPluginOptions } from '../labs/next/presets/default';
import { EditorPresetProps } from '../labs/next/presets/types';
import type { InsertNodeAPI } from '../insert-api/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';
export declare function getScrollGutterOptions(props: EditorProps): ScrollGutterPluginOptions | undefined;
export declare function getDefaultPresetOptionsFromEditorProps(props: EditorProps, createAnalyticsEvent?: CreateUIAnalyticsEvent): EditorPresetProps & DefaultPresetPluginOptions;
/**
 * Maps EditorProps to EditorPlugins
 *
 * Note: The order that presets are added determines
 * their placement in the editor toolbar
 */
export default function createPluginsList(props: EditorProps, prevProps?: EditorProps, createAnalyticsEvent?: CreateUIAnalyticsEvent, insertNodeAPI?: InsertNodeAPI, editorAnalyticsAPI?: EditorAnalyticsAPI, editorSelectionAPI?: EditorSelectionAPI, getEditorContainerWidth?: GetEditorContainerWidth): EditorPlugin[];
