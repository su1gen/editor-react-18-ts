import { findSupportedNodeForBreakout } from './find-breakout-node';
/**
 * Get the current mode of the breakout at the selection
 * @param state Current EditorState
 */

export function getBreakoutMode(state) {
  var node = findSupportedNodeForBreakout(state.selection);

  if (!node) {
    return;
  }

  var breakoutMark = node.node.marks.find(function (m) {
    return m.type.name === 'breakout';
  });

  if (!breakoutMark) {
    return;
  }

  return breakoutMark.attrs.mode;
}