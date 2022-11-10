"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNodeAWrappingBlockNode = void 0;

var _types = require("./types");

var isNodeAWrappingBlockNode = function isNodeAWrappingBlockNode(node) {
  if (!node) {
    return false;
  }

  return _types.WRAPPER_BLOCK_TYPES.some(function (blockNode) {
    return blockNode.name === node.type.name;
  });
};

exports.isNodeAWrappingBlockNode = isNodeAWrappingBlockNode;