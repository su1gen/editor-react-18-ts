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

const Issue16 = props => {
  const {
    intl
  } = props;
  return /*#__PURE__*/React.createElement(Issue16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconIssueLabel)
  });
};

const Bug16 = props => {
  const {
    intl
  } = props;
  return /*#__PURE__*/React.createElement(Bug16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconBugLabel)
  });
};

const Story16 = props => {
  const {
    intl
  } = props;
  return /*#__PURE__*/React.createElement(Story16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconStoryLabel)
  });
};

const Task16 = props => {
  const {
    intl
  } = props;
  return /*#__PURE__*/React.createElement(Task16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconTaskLabel)
  });
};

const Page16 = props => {
  const {
    intl
  } = props;
  return /*#__PURE__*/React.createElement(Page16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconPageLabel)
  });
};

const Blog16 = props => {
  const {
    intl
  } = props;
  return /*#__PURE__*/React.createElement(Blog16Icon, {
    label: intl.formatMessage(utilMessages.hyperlinkIconBlogLabel)
  });
};

const IntlIssue16Icon = injectIntl(Issue16);
const IntlBug16Icon = injectIntl(Bug16);
const IntlStory16Icon = injectIntl(Story16);
const IntlTask16Icon = injectIntl(Task16);
const IntlPage16Icon = injectIntl(Page16);
const IntlBlog16Icon = injectIntl(Blog16);
export const mapContentTypeToIcon = {
  'jira.issue': /*#__PURE__*/React.createElement(IntlIssue16Icon, null),
  'jira.issue.bug': /*#__PURE__*/React.createElement(IntlBug16Icon, null),
  'jira.issue.story': /*#__PURE__*/React.createElement(IntlStory16Icon, null),
  'jira.issue.task': /*#__PURE__*/React.createElement(IntlTask16Icon, null),
  'confluence.page': /*#__PURE__*/React.createElement(IntlPage16Icon, null),
  'confluence.blogpost': /*#__PURE__*/React.createElement(IntlBlog16Icon, null)
};
export const sha1 = input => {
  return Rusha.createHash().update(input).digest('hex');
};
export const wordCount = input => {
  return input.split(' ').length;
};