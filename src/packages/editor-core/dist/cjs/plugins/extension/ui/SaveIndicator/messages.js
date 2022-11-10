"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = void 0;

var _reactIntlNext = require("react-intl-next");

var messages = (0, _reactIntlNext.defineMessages)({
  saveIndicator: {
    id: 'fabric.editor.extensions.config-panel.save-indicator',
    defaultMessage: 'All changes are always autosaved',
    description: 'Message shown to the user to notify to them that we save the changes automatically.'
  }
});
exports.messages = messages;