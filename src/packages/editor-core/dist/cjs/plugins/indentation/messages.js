"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = void 0;

var _reactIntlNext = require("react-intl-next");

// Common Translations will live here
var messages = (0, _reactIntlNext.defineMessages)({
  indent: {
    id: 'fabric.editor.indent',
    defaultMessage: 'Indent',
    description: 'Indent a list item, paragraph or heading'
  },
  outdent: {
    id: 'fabric.editor.outdent',
    defaultMessage: 'Outdent',
    description: 'Outdent a list item, paragraph or heading'
  }
});
exports.messages = messages;