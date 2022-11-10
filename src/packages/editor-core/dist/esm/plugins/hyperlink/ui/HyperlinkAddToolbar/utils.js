import React from 'react';
import Rusha from 'rusha';
import Issue16Icon from '@atlaskit/icon-object/glyph/issue/16';
import Bug16Icon from '@atlaskit/icon-object/glyph/bug/16';
import Story16Icon from '@atlaskit/icon-object/glyph/story/16';
import Task16Icon from '@atlaskit/icon-object/glyph/task/16';
import Page16Icon from '@atlaskit/icon-object/glyph/page/16';
import Blog16Icon from '@atlaskit/icon-object/glyph/blog/16';
import { injectIntl } from 'react-intl-next';
import { utilMessages } from './messages';

var Issue16 = function Issue16(props) {
  var intl = props.intl;
  return /*#__PURE__*/React.createElement(Issue16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconIssueLabel)
  });
};

var Bug16 = function Bug16(props) {
  var intl = props.intl;
  return /*#__PURE__*/React.createElement(Bug16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconBugLabel)
  });
};

var Story16 = function Story16(props) {
  var intl = props.intl;
  return /*#__PURE__*/React.createElement(Story16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconStoryLabel)
  });
};

var Task16 = function Task16(props) {
  var intl = props.intl;
  return /*#__PURE__*/React.createElement(Task16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconTaskLabel)
  });
};

var Page16 = function Page16(props) {
  var intl = props.intl;
  return /*#__PURE__*/React.createElement(Page16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconPageLabel)
  });
};

var Blog16 = function Blog16(props) {
  var intl = props.intl;
  return /*#__PURE__*/React.createElement(Blog16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconBlogLabel)
  });
};

var IntlIssue16Icon = injectIntl(Issue16);
var IntlBug16Icon = injectIntl(Bug16);
var IntlStory16Icon = injectIntl(Story16);
var IntlTask16Icon = injectIntl(Task16);
var IntlPage16Icon = injectIntl(Page16);
var IntlBlog16Icon = injectIntl(Blog16);
export var mapContentTypeToIcon = {
  'jira.issue': /*#__PURE__*/React.createElement(IntlIssue16Icon, null),
  'jira.issue.bug': /*#__PURE__*/React.createElement(IntlBug16Icon, null),
  'jira.issue.story': /*#__PURE__*/React.createElement(IntlStory16Icon, null),
  'jira.issue.task': /*#__PURE__*/React.createElement(IntlTask16Icon, null),
  'confluence.page': /*#__PURE__*/React.createElement(IntlPage16Icon, null),
  'confluence.blogpost': /*#__PURE__*/React.createElement(IntlBlog16Icon, null)
};
export var sha1 = function sha1(input) {
  return Rusha.createHash().update(input).digest('hex');
};
export var wordCount = function wordCount(input) {
  return input.split(' ').length;
};