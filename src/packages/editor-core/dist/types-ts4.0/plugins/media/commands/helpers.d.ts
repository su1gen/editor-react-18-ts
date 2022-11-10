import type { Command } from '../../../types/command';
import type { MediaNodeWithPosHandler, MediaPluginState } from '../pm-plugins/types';
import { EditorState } from 'prosemirror-state';
export declare const findMediaSingleNode: (mediaPluginState: MediaPluginState, id: string) => MediaNodeWithPosHandler | null;
/**
 * Finds the media inline node with the given id.
 * Media Inline is inserted like a media single node into the media plugin state.
 * However it is not of type mediaSingle.
 *
 * @param mediaPluginState
 * @param id
 * @param isMediaSingle
 * @returns {MediaNodeWithPosHandler | null}
 */
export declare const findMediaInlineNode: (mediaPluginState: MediaPluginState, id: string, isMediaSingle: boolean) => MediaNodeWithPosHandler | null;
export declare const findAllMediaSingleNodes: (mediaPluginState: MediaPluginState, id: string) => MediaNodeWithPosHandler[];
export declare const findMediaNode: (mediaPluginState: MediaPluginState, id: string, isMediaSingle: boolean) => MediaNodeWithPosHandler | null;
export declare const isMediaNode: (pos: number, state: EditorState) => boolean | null | undefined;
export declare const updateAllMediaNodesAttrs: (id: string, attrs: object, isMediaSingle: boolean) => Command;
export declare const updateMediaNodeAttrs: (id: string, attrs: object, isMediaSingle: boolean) => Command;
export declare const replaceExternalMedia: (pos: number, attrs: object) => Command;
