import { MediaBaseAttributes } from '@atlaskit/adf-schema';
import { EditorState } from 'prosemirror-state';
import { MediaPluginState } from '../pm-plugins/types';
export declare const getSelectedMediaContainerNodeAttrs: (mediaPluginState: MediaPluginState) => MediaBaseAttributes | null;
export declare const downloadMedia: (mediaPluginState: MediaPluginState) => Promise<boolean>;
export declare const removeMediaGroupNode: (state: EditorState) => import("prosemirror-state").Transaction<any>;
