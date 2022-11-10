"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listsStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _utils = require("@atlaskit/editor-common/utils");

var _styles = require("@atlaskit/editor-common/styles");

var _templateObject;

var listsStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror li {\n    position: relative;\n\n    > p:not(:first-child) {\n      margin: 4px 0 0 0;\n    }\n\n    // In SSR the above rule will apply to all p tags because first-child would be a style tag.\n    // The following rule resets the first p tag back to its original margin\n    // defined in packages/editor/editor-common/src/styles/shared/paragraph.ts\n    > style:first-child + p {\n      margin-top: ", ";\n    }\n\n    ", "\n  }\n"])), _editorSharedStyles.blockNodesVerticalMargin, _utils.browser.safari ? _styles.codeBlockInListSafariFix : '');
exports.listsStyles = listsStyles;