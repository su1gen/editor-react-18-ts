"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = void 0;

var _reactIntlNext = require("react-intl-next");

var messages = (0, _reactIntlNext.defineMessages)({
  undo: {
    id: 'fabric.editor.undo',
    defaultMessage: 'Undo',
    description: 'Undo the previously performed action.'
  },
  redo: {
    id: 'fabric.editor.redo',
    defaultMessage: 'Redo',
    description: 'Redo the previously undone action.'
  }
});
exports.messages = messages;