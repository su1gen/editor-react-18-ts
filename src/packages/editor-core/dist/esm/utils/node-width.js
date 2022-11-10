export { getParentNodeWidth } from '@atlaskit/editor-common/node-width';
/**
 * Returns the breakout mode of a given node
 */

export var getBreakoutMode = function getBreakoutMode(node, breakout) {
  var breakoutMark = breakout && breakout.isInSet(node.marks);
  return breakoutMark ? breakoutMark.attrs.mode : node.attrs.layout;
};