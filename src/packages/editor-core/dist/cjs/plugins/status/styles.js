"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statusStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _styles = require("@atlaskit/editor-common/styles");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _templateObject;

var statusStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .", ",\n    .", ",\n    [data-layout-section] {\n    .", " {\n      max-width: 100%;\n      line-height: 0;\n\n      > span {\n        width: 100%;\n      }\n    }\n  }\n  .", " {\n    > span {\n      cursor: pointer;\n      line-height: 0; /* Prevent responsive layouts increasing height of container. */\n    }\n\n    &.", "\n      .", "\n      > span {\n      ", "\n    }\n  }\n\n  .danger {\n    .", " > span {\n      background-color: ", ";\n    }\n\n    .", ".", "\n      .", "\n      > span {\n      box-shadow: 0 0 0 ", "px ", ";\n    }\n  }\n"])), _styles.TableSharedCssClassName.TABLE_CELL_WRAPPER, _styles.TableSharedCssClassName.TABLE_HEADER_CELL_WRAPPER, _styles.StatusSharedCssClassName.STATUS_CONTAINER, _styles.StatusSharedCssClassName.STATUS_CONTAINER, _editorSharedStyles.akEditorSelectedNodeClassName, _styles.StatusSharedCssClassName.STATUS_LOZENGE, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow]), _styles.StatusSharedCssClassName.STATUS_LOZENGE, _editorSharedStyles.akEditorDeleteBackgroundWithOpacity, _styles.StatusSharedCssClassName.STATUS_CONTAINER, _editorSharedStyles.akEditorSelectedNodeClassName, _styles.StatusSharedCssClassName.STATUS_LOZENGE, _editorSharedStyles.akEditorSelectedBorderSize, _editorSharedStyles.akEditorDeleteBorder);
exports.statusStyles = statusStyles;