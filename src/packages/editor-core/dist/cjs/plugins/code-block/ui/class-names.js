"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.codeBlockClassNames = void 0;

var _styles = require("@atlaskit/editor-common/styles");

var codeBlockClassNames = {
  start: _styles.CodeBlockSharedCssClassName.CODEBLOCK_START,
  end: _styles.CodeBlockSharedCssClassName.CODEBLOCK_END,
  gutter: _styles.CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER,
  content: _styles.CodeBlockSharedCssClassName.CODEBLOCK_CONTENT
};
exports.codeBlockClassNames = codeBlockClassNames;