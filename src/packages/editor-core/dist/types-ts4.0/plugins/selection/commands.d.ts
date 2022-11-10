import { Selection } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { Command } from '../../types';
import { RelativeSelectionPos } from './types';
export declare const setSelectionRelativeToNode: (selectionRelativeToNode?: RelativeSelectionPos | undefined, selection?: Selection<any> | null | undefined) => import("@atlaskit/editor-common/types").Command;
export declare const arrowRight: Command;
export declare const arrowLeft: Command;
export declare const setSelectionInsideAtNodeEnd: (selectionRelativeToNode: RelativeSelectionPos, node: PmNode, from: number, to: number) => Command;
