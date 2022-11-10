"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InlineNodeViewSharedStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _utils = require("@atlaskit/editor-common/utils");

var _getInlineNodeViewProducer = require("./getInlineNodeViewProducer");

var _templateObject;

// For reasoning behind styles, see comments in:
// ./getInlineNodeViewProducer -> portalChildren()
var InlineNodeViewSharedStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .", " {\n    display: inline;\n    user-select: all;\n    /* Collapses zero width spaces inside the inline node view\n    to prevent the node from line breaking too early.\n    */\n    white-space: nowrap;\n    /* Then reset to the Editor default so we don't interfere\n    with any component styling. */\n    & > * {\n      white-space: pre-wrap;\n    }\n  }\n  /** Remove browser deafult selections style. This prevents\n    unexpected visual artefacts in Safari when navigating\n    with the keyboard or making range selections. */\n  &.ua-safari {\n    .", " {\n      ::selection,\n      *::selection {\n        background: transparent;\n      }\n    }\n  }\n\n  &.ua-chrome .", " > span {\n    user-select: none;\n  }\n\n  .", "AddZeroWidthSpace {\n    ::after {\n      content: '", "';\n    }\n  }\n"])), _getInlineNodeViewProducer.inlineNodeViewClassname, _getInlineNodeViewProducer.inlineNodeViewClassname, _getInlineNodeViewProducer.inlineNodeViewClassname, _getInlineNodeViewProducer.inlineNodeViewClassname, _utils.ZERO_WIDTH_SPACE);
exports.InlineNodeViewSharedStyles = InlineNodeViewSharedStyles;