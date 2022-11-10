"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSupportedNodeForBreakout = isSupportedNodeForBreakout;
var supportedNodesForBreakout = ['codeBlock', 'layoutSection', 'expand'];
/**
 * Check if breakout can be applied to a node
 * @param node Node to check
 */

function isSupportedNodeForBreakout(node) {
  return supportedNodesForBreakout.indexOf(node.type.name) !== -1;
}