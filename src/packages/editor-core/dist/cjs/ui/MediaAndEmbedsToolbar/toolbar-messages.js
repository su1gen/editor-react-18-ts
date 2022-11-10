"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toolbarMessages = void 0;

var _reactIntlNext = require("react-intl-next");

var toolbarMessages = (0, _reactIntlNext.defineMessages)({
  wrapLeft: {
    id: 'fabric.editor.wrapLeft',
    defaultMessage: 'Wrap left',
    description: 'Aligns your image to the left and wraps text around it.'
  },
  wrapRight: {
    id: 'fabric.editor.wrapRight',
    defaultMessage: 'Wrap right',
    description: 'Aligns your image to the right and wraps text around it.'
  }
});
exports.toolbarMessages = toolbarMessages;