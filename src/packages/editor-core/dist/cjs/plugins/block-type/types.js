"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WRAPPER_BLOCK_TYPES = exports.TEXT_BLOCK_TYPES = exports.PANEL = exports.OTHER = exports.NORMAL_TEXT = exports.HEADING_6 = exports.HEADING_5 = exports.HEADING_4 = exports.HEADING_3 = exports.HEADING_2 = exports.HEADING_1 = exports.HEADINGS_BY_NAME = exports.HEADINGS_BY_LEVEL = exports.CODE_BLOCK = exports.BLOCK_QUOTE = exports.ALL_BLOCK_TYPES = void 0;

var _messages = require("./messages");

// The names of the blocks don't map precisely to schema nodes, because
// of concepts like "paragraph" <-> "Normal text" and "Unknown".
//
// (there are also different blocks for different types of panel, when
// they're really all just a panel node)
//
// Rather than half-match half-not, this plugin introduces its own
// nomenclature for what 'block type' is active.
var NORMAL_TEXT = {
  name: 'normal',
  title: _messages.messages.normal,
  nodeName: 'paragraph',
  tagName: 'p'
};
exports.NORMAL_TEXT = NORMAL_TEXT;
var HEADING_1 = {
  name: 'heading1',
  title: _messages.messages.heading1,
  nodeName: 'heading',
  tagName: 'h1',
  level: 1
};
exports.HEADING_1 = HEADING_1;
var HEADING_2 = {
  name: 'heading2',
  title: _messages.messages.heading2,
  nodeName: 'heading',
  tagName: 'h2',
  level: 2
};
exports.HEADING_2 = HEADING_2;
var HEADING_3 = {
  name: 'heading3',
  title: _messages.messages.heading3,
  nodeName: 'heading',
  tagName: 'h3',
  level: 3
};
exports.HEADING_3 = HEADING_3;
var HEADING_4 = {
  name: 'heading4',
  title: _messages.messages.heading4,
  nodeName: 'heading',
  tagName: 'h4',
  level: 4
};
exports.HEADING_4 = HEADING_4;
var HEADING_5 = {
  name: 'heading5',
  title: _messages.messages.heading5,
  nodeName: 'heading',
  tagName: 'h5',
  level: 5
};
exports.HEADING_5 = HEADING_5;
var HEADING_6 = {
  name: 'heading6',
  title: _messages.messages.heading6,
  nodeName: 'heading',
  tagName: 'h6',
  level: 6
};
exports.HEADING_6 = HEADING_6;
var BLOCK_QUOTE = {
  name: 'blockquote',
  title: _messages.messages.blockquote,
  nodeName: 'blockquote'
};
exports.BLOCK_QUOTE = BLOCK_QUOTE;
var CODE_BLOCK = {
  name: 'codeblock',
  title: _messages.messages.codeblock,
  nodeName: 'codeBlock'
};
exports.CODE_BLOCK = CODE_BLOCK;
var PANEL = {
  name: 'panel',
  title: _messages.messages.infoPanel,
  nodeName: 'panel'
};
exports.PANEL = PANEL;
var OTHER = {
  name: 'other',
  title: _messages.messages.other,
  nodeName: ''
};
exports.OTHER = OTHER;
var TEXT_BLOCK_TYPES = [NORMAL_TEXT, HEADING_1, HEADING_2, HEADING_3, HEADING_4, HEADING_5, HEADING_6];
exports.TEXT_BLOCK_TYPES = TEXT_BLOCK_TYPES;
var WRAPPER_BLOCK_TYPES = [BLOCK_QUOTE, CODE_BLOCK, PANEL];
exports.WRAPPER_BLOCK_TYPES = WRAPPER_BLOCK_TYPES;
var ALL_BLOCK_TYPES = TEXT_BLOCK_TYPES.concat(WRAPPER_BLOCK_TYPES);
exports.ALL_BLOCK_TYPES = ALL_BLOCK_TYPES;
var HEADINGS_BY_LEVEL = TEXT_BLOCK_TYPES.reduce(function (acc, blockType) {
  if (blockType.level && blockType.nodeName === 'heading') {
    acc[blockType.level] = blockType;
  }

  return acc;
}, {});
exports.HEADINGS_BY_LEVEL = HEADINGS_BY_LEVEL;
var HEADINGS_BY_NAME = TEXT_BLOCK_TYPES.reduce(function (acc, blockType) {
  if (blockType.level && blockType.nodeName === 'heading') {
    acc[blockType.name] = blockType;
  }

  return acc;
}, {});
exports.HEADINGS_BY_NAME = HEADINGS_BY_NAME;