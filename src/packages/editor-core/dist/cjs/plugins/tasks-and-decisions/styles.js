"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taskDecisionStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _styles = require("@atlaskit/editor-common/styles");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var taskDecisionStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  [data-decision-wrapper] {\n    cursor: pointer;\n  }\n\n  .", " > [data-decision-wrapper],\n  ol[data-node-type='decisionList'].", " {\n    border-radius: 4px;\n    ", "\n  }\n\n  .danger {\n    .", ".", "\n      > div {\n      box-shadow: 0 0 0 ", "px\n        ", ";\n      background-color: ", ";\n      &::after {\n        content: none; /* reset the Blanket selection style */\n      }\n    }\n  }\n"])), _editorSharedStyles.akEditorSelectedNodeClassName, _editorSharedStyles.akEditorSelectedNodeClassName, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow, _editorSharedStyles.SelectionStyle.Blanket]), _styles.TaskDecisionSharedCssClassName.DECISION_CONTAINER, _editorSharedStyles.akEditorSelectedNodeClassName, _editorSharedStyles.akEditorSelectedBorderSize, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder), (0, _tokens.token)('color.blanket.danger', _editorSharedStyles.akEditorDeleteBackgroundWithOpacity));
exports.taskDecisionStyles = taskDecisionStyles;