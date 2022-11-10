"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.table = exports.status = exports.placeholder = exports.panel = exports.more = exports.mention = exports.media = exports.link = exports.layout = exports.imageUpload = exports.horizontalrule = exports.expand = exports.emoji = exports.decision = exports.date = exports.codeblock = exports.blockquote = exports.action = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _decision = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/decision"));

var _task = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/task"));

var _table = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/table"));

var _image = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/image"));

var _mention = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/mention"));

var _more = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/more"));

var _link = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/link"));

var _emoji = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/emoji"));

var _date = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/date"));

var _status = _interopRequireDefault(require("@atlaskit/icon/glyph/status"));

var _chevronRightCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-right-circle"));

var _text = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/text"));

var _layoutTwoEqual = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-two-equal"));

var _horizontalRule = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/horizontal-rule"));

var _code = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/code"));

var _info = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/info"));

var _quote = _interopRequireDefault(require("@atlaskit/icon/glyph/quote"));

var _styles = require("../../../../ui/styles");

var _keymaps = require("../../../../keymaps");

var _shallowEquals = require("./shallow-equals");

/** @jsx jsx */
var from = function from(init) {
  return {
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    value: {
      name: init.name
    },
    elemBefore: (0, _react2.jsx)(init.Icon, {
      label: init.content
    }),
    elemAfter: init.shortcut ? (0, _react2.jsx)("div", {
      css: _styles.shortcutStyle
    }, init.shortcut) : undefined,
    'aria-label': init.content,
    'aria-haspopup': init['aria-haspopup'],
    shortcut: init.shortcut,
    isDisabled: init.disabled
  };
};

var mem = function mem(fn) {
  return (0, _memoizeOne.default)(fn, _shallowEquals.shallowEquals);
};

var action = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'action',
    shortcut: '[]',
    Icon: _task.default
  });
});
exports.action = action;
var link = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'link',
    shortcut: (0, _keymaps.tooltip)(_keymaps.addLink),
    Icon: _link.default,
    'aria-haspopup': init['aria-haspopup']
  });
});
exports.link = link;
var media = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'media',
    Icon: _image.default
  });
});
exports.media = media;
var imageUpload = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'image upload',
    Icon: _image.default
  });
});
exports.imageUpload = imageUpload;
var mention = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'mention',
    Icon: _mention.default,
    shortcut: '@',
    'aria-haspopup': init['aria-haspopup']
  });
});
exports.mention = mention;
var emoji = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'emoji',
    Icon: _emoji.default,
    shortcut: ':',
    'aria-haspopup': init['aria-haspopup']
  });
});
exports.emoji = emoji;
var table = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'table',
    Icon: _table.default,
    shortcut: (0, _keymaps.tooltip)(_keymaps.toggleTable)
  });
});
exports.table = table;
var layout = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'layout',
    Icon: _layoutTwoEqual.default
  });
});
exports.layout = layout;
var codeblock = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'codeblock',
    Icon: _code.default,
    shortcut: init.shortcut
  });
});
exports.codeblock = codeblock;
var panel = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'panel',
    Icon: _info.default,
    shortcut: init.shortcut
  });
});
exports.panel = panel;
var blockquote = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'blockquote',
    Icon: _quote.default,
    shortcut: init.shortcut
  });
});
exports.blockquote = blockquote;
var decision = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'decision',
    Icon: _decision.default,
    shortcut: '<>'
  });
});
exports.decision = decision;
var horizontalrule = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'horizontalrule',
    Icon: _horizontalRule.default,
    shortcut: '---'
  });
});
exports.horizontalrule = horizontalrule;
var expand = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'expand',
    Icon: _chevronRightCircle.default
  });
});
exports.expand = expand;
var date = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'date',
    Icon: _date.default,
    shortcut: '//'
  });
});
exports.date = date;
var placeholder = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'placeholder text',
    Icon: function Icon() {
      return (0, _react2.jsx)(_text.default, {
        label: ""
      });
    }
  });
});
exports.placeholder = placeholder;
var status = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'status',
    Icon: _status.default
  });
});
exports.status = status;
var more = mem(function (init) {
  return from({
    content: init.content,
    tooltipDescription: init.tooltipDescription,
    disabled: init.disabled,
    name: 'macro',
    Icon: function Icon() {
      return (0, _react2.jsx)(_more.default, {
        label: ""
      });
    }
  });
});
exports.more = more;