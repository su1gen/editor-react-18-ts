"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dateMessages", {
  enumerable: true,
  get: function get() {
    return _messages3.messages;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "linkMessages", {
  enumerable: true,
  get: function get() {
    return _messages.linkMessages;
  }
});
exports.linkToolbarMessages = void 0;
Object.defineProperty(exports, "statusMessages", {
  enumerable: true,
  get: function get() {
    return _messages2.messages;
  }
});

var _reactIntlNext = require("react-intl-next");

var _messages = _interopRequireWildcard(require("@atlaskit/editor-common/messages"));

var _messages2 = require("./plugins/status/nodeviews/messages");

var _messages3 = require("./plugins/date/nodeviews/messages");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Common Translations will live here
var linkToolbarMessages = (0, _reactIntlNext.defineMessages)({
  addLink: {
    id: 'fabric.editor.mediaAddLink',
    defaultMessage: 'Add link',
    description: 'Add link'
  },
  unableToOpenLink: {
    id: 'fabric.editor.unableToOpenLink',
    defaultMessage: 'Unable to open this link',
    description: 'Unable to open this link'
  },
  unlink: {
    id: 'fabric.editor.unlink',
    defaultMessage: 'Unlink',
    description: 'Removes the hyperlink but keeps your text.'
  },
  editLink: {
    id: 'fabric.editor.editLink',
    defaultMessage: 'Edit link',
    description: 'Edit the link, update display text'
  },
  placeholder: {
    id: 'fabric.editor.hyperlinkToolbarPlaceholder',
    defaultMessage: 'Paste or search for link',
    description: 'Paste or search for link'
  },
  linkPlaceholder: {
    id: 'fabric.editor.linkPlaceholder',
    defaultMessage: 'Paste link',
    description: 'Create a new link by pasting a URL.'
  },
  linkAddress: {
    id: 'fabric.editor.linkAddress',
    defaultMessage: 'Link address',
    description: 'Insert the address of the link'
  },
  invalidLink: {
    id: 'fabric.editor.invalidLink',
    defaultMessage: 'Please enter a valid link.',
    description: 'Please enter a valid link.'
  },
  emptyLink: {
    id: 'fabric.editor.emptyLink',
    defaultMessage: 'Please enter a link.',
    description: 'Please enter a link.'
  },
  settingsLink: {
    id: 'fabric.editor.settingsLinks',
    defaultMessage: 'Go to Link Preferences',
    description: 'Go to Link Preferences'
  }
});
exports.linkToolbarMessages = linkToolbarMessages;
var _default = _messages.default;
exports.default = _default;