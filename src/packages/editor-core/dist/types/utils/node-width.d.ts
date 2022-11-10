import { Node as PMNode, MarkType } from 'prosemirror-model';
import { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
export { getParentNodeWidth } from '@atlaskit/editor-common/node-width';
/**
 * Returns the breakout mode of a given node
 */
export declare const getBreakoutMode: (node: PMNode, breakout: MarkType) => BreakoutMarkAttrs['mode'] | undefined;
