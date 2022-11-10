export { getParentNodeWidth } from '@atlaskit/editor-common/node-width';
/**
 * Returns the breakout mode of a given node
 */

export const getBreakoutMode = (node, breakout) => {
  const breakoutMark = breakout && breakout.isInSet(node.marks);
  return breakoutMark ? breakoutMark.attrs.mode : node.attrs.layout;
};