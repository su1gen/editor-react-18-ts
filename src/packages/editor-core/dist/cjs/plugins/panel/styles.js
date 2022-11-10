"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panelStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _panel = require("@atlaskit/editor-common/panel");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var panelStyles = function panelStyles(props) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror {\n    .", " {\n      cursor: pointer;\n\n      /* Danger when top level node */\n      &.danger {\n        box-shadow: 0 0 0 ", "px\n          ", ";\n        background-color: ", " !important;\n\n        .", " {\n          color: ", " !important;\n        }\n      }\n    }\n\n    .", " {\n      cursor: text;\n    }\n\n    /* Danger when nested node */\n    .danger .", " {\n      &[data-panel-type] {\n        background-color: ", ";\n\n        .", " {\n          color: ", ";\n        }\n      }\n    }\n\n    ", ";\n  }\n\n  .", ".", ":not(.danger) {\n    ", "\n  }\n"])), _panel.PanelSharedCssClassName.prefix, _editorSharedStyles.akEditorSelectedBorderSize, _editorSharedStyles.akEditorDeleteBorder, (0, _tokens.token)('color.background.danger', _editorSharedStyles.akEditorDeleteBackground), _panel.PanelSharedCssClassName.icon, (0, _tokens.token)('color.icon.danger', _editorSharedStyles.akEditorDeleteIconColor), _panel.PanelSharedCssClassName.content, _panel.PanelSharedCssClassName.prefix, (0, _tokens.token)('color.blanket.danger', _editorSharedStyles.akEditorDeleteBackgroundWithOpacity), _panel.PanelSharedCssClassName.icon, (0, _tokens.token)('color.icon.danger', _editorSharedStyles.akEditorDeleteIconColor), (0, _panel.panelSharedStyles)(props), _panel.PanelSharedCssClassName.prefix, _editorSharedStyles.akEditorSelectedNodeClassName, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow, _editorSharedStyles.SelectionStyle.Blanket]));
};

exports.panelStyles = panelStyles;