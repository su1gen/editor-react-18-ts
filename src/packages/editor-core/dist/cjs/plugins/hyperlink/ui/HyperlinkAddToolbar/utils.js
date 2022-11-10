"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wordCount = exports.sha1 = exports.mapContentTypeToIcon = void 0;

var _react = _interopRequireDefault(require("react"));

var _rusha = _interopRequireDefault(require("rusha"));

var _ = _interopRequireDefault(require("@atlaskit/icon-object/glyph/issue/16"));

var _2 = _interopRequireDefault(require("@atlaskit/icon-object/glyph/bug/16"));

var _3 = _interopRequireDefault(require("@atlaskit/icon-object/glyph/story/16"));

var _4 = _interopRequireDefault(require("@atlaskit/icon-object/glyph/task/16"));

var _5 = _interopRequireDefault(require("@atlaskit/icon-object/glyph/page/16"));

var _6 = _interopRequireDefault(require("@atlaskit/icon-object/glyph/blog/16"));

var _reactIntlNext = require("react-intl-next");

var _messages = require("./messages");

var Issue16 = function Issue16(props) {
  var intl = props.intl;
  return /*#__PURE__*/_react.default.createElement(_.default, {
    label: intl.formatMessage(_messages.utilMessages.hyperlinkIconIssueLabel)
  });
};

var Bug16 = function Bug16(props) {
  var intl = props.intl;
  return /*#__PURE__*/_react.default.createElement(_2.default, {
    label: intl.formatMessage(_messages.utilMessages.hyperlinkIconBugLabel)
  });
};

var Story16 = function Story16(props) {
  var intl = props.intl;
  return /*#__PURE__*/_react.default.createElement(_3.default, {
    label: intl.formatMessage(_messages.utilMessages.hyperlinkIconStoryLabel)
  });
};

var Task16 = function Task16(props) {
  var intl = props.intl;
  return /*#__PURE__*/_react.default.createElement(_4.default, {
    label: intl.formatMessage(_messages.utilMessages.hyperlinkIconTaskLabel)
  });
};

var Page16 = function Page16(props) {
  var intl = props.intl;
  return /*#__PURE__*/_react.default.createElement(_5.default, {
    label: intl.formatMessage(_messages.utilMessages.hyperlinkIconPageLabel)
  });
};

var Blog16 = function Blog16(props) {
  var intl = props.intl;
  return /*#__PURE__*/_react.default.createElement(_6.default, {
    label: intl.formatMessage(_messages.utilMessages.hyperlinkIconBlogLabel)
  });
};

var IntlIssue16Icon = (0, _reactIntlNext.injectIntl)(Issue16);
var IntlBug16Icon = (0, _reactIntlNext.injectIntl)(Bug16);
var IntlStory16Icon = (0, _reactIntlNext.injectIntl)(Story16);
var IntlTask16Icon = (0, _reactIntlNext.injectIntl)(Task16);
var IntlPage16Icon = (0, _reactIntlNext.injectIntl)(Page16);
var IntlBlog16Icon = (0, _reactIntlNext.injectIntl)(Blog16);
var mapContentTypeToIcon = {
  'jira.issue': /*#__PURE__*/_react.default.createElement(IntlIssue16Icon, null),
  'jira.issue.bug': /*#__PURE__*/_react.default.createElement(IntlBug16Icon, null),
  'jira.issue.story': /*#__PURE__*/_react.default.createElement(IntlStory16Icon, null),
  'jira.issue.task': /*#__PURE__*/_react.default.createElement(IntlTask16Icon, null),
  'confluence.page': /*#__PURE__*/_react.default.createElement(IntlPage16Icon, null),
  'confluence.blogpost': /*#__PURE__*/_react.default.createElement(IntlBlog16Icon, null)
};
exports.mapContentTypeToIcon = mapContentTypeToIcon;

var sha1 = function sha1(input) {
  return _rusha.default.createHash().update(input).digest('hex');
};

exports.sha1 = sha1;

var wordCount = function wordCount(input) {
  return input.split(' ').length;
};

exports.wordCount = wordCount;