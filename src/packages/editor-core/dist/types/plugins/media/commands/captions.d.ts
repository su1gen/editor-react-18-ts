import { Node as PMNode } from 'prosemirror-model';
import { Command } from '../../../types';
export declare const selectCaptionFromMediaSinglePos: (mediaSingleNodePos: number, mediaSingleNode: PMNode) => Command;
export declare const insertAndSelectCaptionFromMediaSinglePos: (mediaSingleNodePos: number, mediaSingleNode: PMNode) => Command;
