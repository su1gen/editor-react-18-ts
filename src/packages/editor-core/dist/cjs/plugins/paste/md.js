"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.md = void 0;

var _markdownIt = _interopRequireDefault(require("markdown-it"));

var _linkifyMdPlugin = _interopRequireDefault(require("./linkify-md-plugin"));

var _newlineMdPlugin = _interopRequireDefault(require("./newline-md-plugin"));

var _paragraphMdPlugin = _interopRequireDefault(require("./paragraph-md-plugin"));

var md = (0, _markdownIt.default)('zero', {
  html: false
});
exports.md = md;
md.enable([// Process html entity - &#123;, &#xAF;, &quot;, ...
'entity', // Process escaped chars and hardbreaks
'escape', 'newline']);
md.use(_paragraphMdPlugin.default); // enable modified version of linkify plugin
// @see https://product-fabric.atlassian.net/browse/ED-3097

md.use(_linkifyMdPlugin.default);
md.use(_newlineMdPlugin.default);