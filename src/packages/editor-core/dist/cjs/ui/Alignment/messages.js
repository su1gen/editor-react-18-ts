"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alignmentMessages = void 0;

var _reactIntlNext = require("react-intl-next");

var alignmentMessages = (0, _reactIntlNext.defineMessages)({
  alignLeft: {
    id: 'fabric.editor.alignLeft',
    defaultMessage: 'Align left',
    description: 'Action to align/justify text to the left'
  },
  alignCenter: {
    id: 'fabric.editor.alignCenter',
    defaultMessage: 'Align center',
    description: 'Action to align/justify text to the center/middle'
  },
  alignRight: {
    id: 'fabric.editor.alignRight',
    defaultMessage: 'Align right',
    description: 'Action to align/justify text to the right'
  }
});
exports.alignmentMessages = alignmentMessages;