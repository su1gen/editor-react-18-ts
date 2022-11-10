"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = JIRAIssueNode;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _jiraIcon = require("@atlaskit/logo/jira-icon");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3;

var wrapperNode = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  align-items: center;\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: ", "px;\n  box-sizing: border-box;\n  cursor: default;\n  display: inline-flex;\n  font-size: ", ";\n  margin: 0 2px;\n  min-height: 24px;\n  padding: 0 4px;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n\n  .ProseMirror-selectednode & {\n    background: ", ";\n    outline: none;\n  }\n"])), (0, _tokens.token)('color.background.neutral', _colors.N30), (0, _tokens.token)('color.border', _colors.N50), (0, _constants.borderRadius)(), (0, _editorSharedStyles.relativeFontSizeToBase16)(13), (0, _tokens.token)('color.background.selected', _colors.N50));
var jiraChildNode = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: inline-block;\n  color: ", ";\n  line-height: 24px;\n  vertical-align: top;\n\n  &::before {\n    color: ", ";\n    content: 'JIRA | ';\n  }\n"])), (0, _tokens.token)('color.text.subtlest', '#707070'), (0, _tokens.token)('color.text', 'black'));
var svgChildNode = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: inline-block;\n  height: 24px;\n  vertical-align: top;\n  width: 24px;\n\n  & > div {\n    height: 24px;\n    width: 24px;\n  }\n"])));

function JIRAIssueNode(props) {
  var issueKey = props.node.attrs.issueKey;
  return (0, _react.jsx)("span", {
    css: wrapperNode,
    "data-testid": "jira-issue-node"
  }, (0, _react.jsx)("span", {
    css: svgChildNode
  }, (0, _react.jsx)(_jiraIcon.JiraIcon, {
    size: "small"
  })), (0, _react.jsx)("span", {
    css: jiraChildNode
  }, issueKey));
}