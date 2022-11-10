"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.smartCardStyles = exports.FLOATING_TOOLBAR_LINKPICKER_CLASSNAME = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _colors = require("@atlaskit/theme/colors");

var _styles = require("@atlaskit/editor-common/styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var FLOATING_TOOLBAR_LINKPICKER_CLASSNAME = 'card-floating-toolbar--link-picker';
exports.FLOATING_TOOLBAR_LINKPICKER_CLASSNAME = FLOATING_TOOLBAR_LINKPICKER_CLASSNAME;
var smartCardStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .", " {\n    max-width: calc(100% - 20px);\n    vertical-align: top;\n    word-break: break-all;\n\n    .card {\n      padding-left: 2px;\n      padding-right: 2px;\n      padding-top: 0.5em;\n      padding-bottom: 0.5em;\n      margin-bottom: -0.5em;\n\n      .", " > a:focus {\n        ", "\n      }\n    }\n\n    &.", "\n      .", "\n      > a {\n      ", "\n    }\n    .", " > a {\n      /* EDM-1717: box-shadow Safari fix start */\n      z-index: 1;\n      position: relative;\n      /* EDM-1717: box-shadow Safari fix end */\n    }\n\n    &.danger {\n      .", " > a {\n        box-shadow: 0 0 0 1px\n          ", ";\n        /* EDM-1717: box-shadow Safari fix start */\n        z-index: 2;\n        /* EDM-1717: box-shadow Safari fix end */\n      }\n    }\n  }\n\n  .", " {\n    .", " > div {\n      cursor: pointer;\n      &:hover {\n        background-color: ", ";\n      }\n    }\n\n    &.", "\n      .", "\n      > div {\n      ", "\n    }\n\n    &.danger {\n      .", " > div {\n        box-shadow: 0 0 0 1px\n          ", " !important;\n      }\n    }\n  }\n\n  .", " {\n    .", " > div {\n      cursor: pointer;\n      &::after {\n        transition: box-shadow 0s;\n      }\n    }\n    &.", "\n      .", "\n      > div {\n      ", "\n    }\n\n    &.", "\n      .", "\n      > div::after {\n      ", "\n    }\n\n    &.danger {\n      .media-card-frame::after {\n        box-shadow: 0 0 0 1px\n          ", " !important;\n        background: ", " !important;\n      }\n      .richMedia-resize-handle-right::after,\n      .richMedia-resize-handle-left::after {\n        background: ", ";\n      }\n    }\n  }\n\n  .", " {\n    padding: 0;\n  }\n"])), _styles.SmartCardSharedCssClassName.INLINE_CARD_CONTAINER, _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow]), _editorSharedStyles.akEditorSelectedNodeClassName, _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow]), _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder), _styles.SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER, _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, (0, _tokens.token)('color.background.neutral.subtle.hovered', _colors.N20), _editorSharedStyles.akEditorSelectedNodeClassName, _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow]), _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder), _styles.SmartCardSharedCssClassName.EMBED_CARD_CONTAINER, _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, _editorSharedStyles.akEditorSelectedNodeClassName, _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow]), _editorSharedStyles.akEditorSelectedNodeClassName, _styles.SmartCardSharedCssClassName.LOADER_WRAPPER, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow]), (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder), (0, _tokens.token)('color.background.danger', _editorSharedStyles.akEditorDeleteBackground), (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder), FLOATING_TOOLBAR_LINKPICKER_CLASSNAME);
exports.smartCardStyles = smartCardStyles;