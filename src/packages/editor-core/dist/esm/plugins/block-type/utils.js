import { WRAPPER_BLOCK_TYPES } from './types';
export var isNodeAWrappingBlockNode = function isNodeAWrappingBlockNode(node) {
  if (!node) {
    return false;
  }

  return WRAPPER_BLOCK_TYPES.some(function (blockNode) {
    return blockNode.name === node.type.name;
  });
};