"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LAYOUT_COLUMN_PADDING", {
  enumerable: true,
  get: function get() {
    return _styles.LAYOUT_COLUMN_PADDING;
  }
});
Object.defineProperty(exports, "LAYOUT_SECTION_MARGIN", {
  enumerable: true,
  get: function get() {
    return _styles.LAYOUT_SECTION_MARGIN;
  }
});
exports.layoutStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _styles = require("@atlaskit/editor-common/styles");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _types = require("@atlaskit/editor-plugin-table/types");

var _consts = require("@atlaskit/editor-plugin-table/ui/consts");

var _templateObject;

var layoutStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror {\n    ", " [data-layout-section] {\n      margin: ", "px -", "px 0;\n      transition: border-color 0.3s ", ";\n      cursor: pointer;\n\n      /* Inner cursor located 26px from left */\n      [data-layout-column] {\n        flex: 1;\n        min-width: 0;\n        border: ", "px solid\n          ", ";\n        border-radius: 4px;\n        padding: ", "px;\n        box-sizing: border-box;\n\n        > div {\n          > :not(style):first-child,\n          > style:first-child + * {\n            margin-top: 0;\n          }\n\n          > .ProseMirror-gapcursor:first-child + *,\n          > style:first-child + .ProseMirror-gapcursor + * {\n            margin-top: 0;\n          }\n\n          > .ProseMirror-gapcursor:first-child + span + *,\n          > style:first-child + .ProseMirror-gapcursor:first-child + span + * {\n            margin-top: 0;\n          }\n\n          > .embedCardView-content-wrap:first-of-type .rich-media-item {\n            margin-top: 0;\n          }\n\n          > .mediaSingleView-content-wrap:first-of-type .rich-media-item {\n            margin-top: 0;\n          }\n\n          > .ProseMirror-gapcursor.-right:first-child\n            + .mediaSingleView-content-wrap\n            .rich-media-item,\n          > style:first-child\n            + .ProseMirror-gapcursor.-right\n            + .mediaSingleView-content-wrap\n            .rich-media-item,\n          > .ProseMirror-gapcursor.-right:first-of-type\n            + .embedCardView-content-wrap\n            .rich-media-item {\n            margin-top: 0;\n          }\n\n          > .ProseMirror-gapcursor:first-child\n            + span\n            + .mediaSingleView-content-wrap\n            .rich-media-item,\n          > style:first-child\n            + .ProseMirror-gapcursor\n            + span\n            + .mediaSingleView-content-wrap\n            .rich-media-item {\n            margin-top: 0;\n          }\n\n          /* Prevent first DecisionWrapper's margin-top: 8px from shifting decisions down\n             and shrinking layout's node selectable area (leniency margin) */\n          > [data-node-type='decisionList'] {\n            li:first-of-type [data-decision-wrapper] {\n              margin-top: 0;\n            }\n          }\n        }\n\n        /* Make the 'content' fill the entire height of the layout column to allow click\n           handler of layout section nodeview to target only data-layout-column */\n        [data-layout-content] {\n          height: 100%;\n          cursor: text;\n        }\n      }\n\n      [data-layout-column] + [data-layout-column] {\n        margin-left: ", "px;\n      }\n\n      @media screen and (max-width: ", "px) {\n        [data-layout-column] + [data-layout-column] {\n          margin-left: 0;\n        }\n      }\n\n      // TODO: Remove the border styles below once design tokens have been enabled and fallbacks are no longer triggered.\n      // This is because the default state already uses the same token and, as such, the hover style won't change anything.\n      // https://product-fabric.atlassian.net/browse/DSP-4441\n      /* Shows the border when cursor is inside a layout */\n      &.selected [data-layout-column],\n      &:hover [data-layout-column] {\n        border-color: ", ";\n      }\n\n      &.selected.danger > [data-layout-column] {\n        background-color: ", ";\n        border-color: ", ";\n      }\n\n      &.", ":not(.danger) {\n        [data-layout-column] {\n          ", "\n        }\n      }\n    }\n  }\n\n  .fabric-editor--full-width-mode .ProseMirror {\n    [data-layout-section] {\n      .", " {\n        margin: 0 ", "px;\n      }\n    }\n  }\n"])), _styles.columnLayoutSharedStyle, (0, _constants.gridSize)() - 1, _editorSharedStyles.akLayoutGutterOffset, _editorSharedStyles.akEditorSwoopCubicBezier, _editorSharedStyles.akEditorSelectedBorderSize, (0, _tokens.token)('color.border', _colors.N40A), _styles.LAYOUT_COLUMN_PADDING, _styles.LAYOUT_SECTION_MARGIN, _editorSharedStyles.gridMediumMaxWidth, (0, _tokens.token)('color.border', _colors.N50A), (0, _tokens.token)('color.background.danger', _editorSharedStyles.akEditorDeleteBackground), (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder), _editorSharedStyles.akEditorSelectedNodeClassName, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.Border, _editorSharedStyles.SelectionStyle.Blanket]), _types.TableCssClassName.TABLE_CONTAINER, _consts.tableMarginFullWidthMode);
exports.layoutStyles = layoutStyles;