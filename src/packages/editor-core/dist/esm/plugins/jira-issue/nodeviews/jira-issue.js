import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { borderRadius } from '@atlaskit/theme/constants';
import { N30, N50 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
var wrapperNode = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  align-items: center;\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: ", "px;\n  box-sizing: border-box;\n  cursor: default;\n  display: inline-flex;\n  font-size: ", ";\n  margin: 0 2px;\n  min-height: 24px;\n  padding: 0 4px;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n\n  .ProseMirror-selectednode & {\n    background: ", ";\n    outline: none;\n  }\n"])), token('color.background.neutral', N30), token('color.border', N50), borderRadius(), relativeFontSizeToBase16(13), token('color.background.selected', N50));
var jiraChildNode = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: inline-block;\n  color: ", ";\n  line-height: 24px;\n  vertical-align: top;\n\n  &::before {\n    color: ", ";\n    content: 'JIRA | ';\n  }\n"])), token('color.text.subtlest', '#707070'), token('color.text', 'black'));
var svgChildNode = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: inline-block;\n  height: 24px;\n  vertical-align: top;\n  width: 24px;\n\n  & > div {\n    height: 24px;\n    width: 24px;\n  }\n"])));
export default function JIRAIssueNode(props) {
  var issueKey = props.node.attrs.issueKey;
  return jsx("span", {
    css: wrapperNode,
    "data-testid": "jira-issue-node"
  }, jsx("span", {
    css: svgChildNode
  }, jsx(JiraIcon, {
    size: "small"
  })), jsx("span", {
    css: jiraChildNode
  }, issueKey));
}