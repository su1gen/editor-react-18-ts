"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = void 0;

var _reactIntlNext = require("react-intl-next");

var messages = (0, _reactIntlNext.defineMessages)({
  inviteItemTitle: {
    id: 'fabric.editor.inviteItem.title',
    defaultMessage: '{userRole, select, admin {Invite} trusted {Invite} other {Add}} teammate to {productName}',
    description: 'Title of the invite teammate item in typeahead plugin'
  },
  mentionsAddLabel: {
    id: 'fabric.editor.mentionsAddLabel',
    defaultMessage: 'add-icon',
    description: 'icon label to describe adding a new mention'
  },
  mentionsIconLabel: {
    id: 'fabric.editor.mentionsIconLabel',
    defaultMessage: 'Mention',
    description: 'icon label to describe the mention icon'
  }
});
exports.messages = messages;