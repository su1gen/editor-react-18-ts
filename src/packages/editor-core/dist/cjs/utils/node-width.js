"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBreakoutMode = void 0;
Object.defineProperty(exports, "getParentNodeWidth", {
  enumerable: true,
  get: function get() {
    return _nodeWidth.getParentNodeWidth;
  }
});

var _nodeWidth = require("@atlaskit/editor-common/node-width");

/**
 * Returns the breakout mode of a given node
 */
var getBreakoutMode = function getBreakoutMode(node, breakout) {
  var breakoutMark = breakout && breakout.isInSet(node.marks);
  return breakoutMark ? breakoutMark.attrs.mode : node.attrs.layout;
};

exports.getBreakoutMode = getBreakoutMode;