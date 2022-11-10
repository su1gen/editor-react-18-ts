import { Node as PMNode } from 'prosemirror-model';
import type { SimplifiedNode } from '@atlaskit/editor-common/analytics';
export type { SimplifiedNode };
export declare const getDocStructure: (doc: PMNode, options?: {
    compact?: boolean | undefined;
} | undefined) => SimplifiedNode | string;
