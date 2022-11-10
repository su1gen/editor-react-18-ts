import { Node as PMNode, Schema, Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { EditorState, Selection } from 'prosemirror-state';
import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import { MediaState } from '../types';
import { WidthPluginState } from '../../width';
import { InputMethodInsertMedia } from '../../analytics';
export interface MediaSingleState extends MediaState {
    dimensions: {
        width: number;
        height: number;
    };
    scaleFactor?: number;
    contextId?: string;
}
export declare const isMediaSingle: (schema: Schema, fileMimeType?: string | undefined) => boolean;
export declare const insertMediaAsMediaSingle: (view: EditorView, node: PMNode, inputMethod: InputMethodInsertMedia) => boolean;
export declare const insertMediaSingleNode: (view: EditorView, mediaState: MediaState, inputMethod?: InputMethodInsertMedia | undefined, collection?: string | undefined, alignLeftOnInsert?: boolean | undefined) => boolean;
export declare const createMediaSingleNode: (schema: Schema, collection: string, alignLeftOnInsert?: boolean | undefined) => (mediaState: MediaSingleState) => PMNode<Schema<any, any>>;
export declare function transformSliceForMedia(slice: Slice, schema: Schema): (selection: Selection) => Slice<any>;
export declare const calcMediaPxWidth: (opts: {
    origWidth: number;
    origHeight: number;
    state: EditorState;
    containerWidth: WidthPluginState;
    layout?: MediaSingleLayout | undefined;
    pctWidth?: number | undefined;
    pos?: number | undefined;
    resizedPctWidth?: number | undefined;
    isFullWidthModeEnabled?: boolean | undefined;
}) => number;
export declare function isCaptionNode(editorView: EditorView): boolean;
