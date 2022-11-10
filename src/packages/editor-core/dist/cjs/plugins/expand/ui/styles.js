"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _components = require("@atlaskit/theme/components");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _ui = require("@atlaskit/editor-common/ui");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _constants2 = require("../../breakout/constants");

var _classNames = require("./class-names");

var _templateObject, _templateObject2;

var EXPAND_SELECTED_BACKGROUND = (0, _components.themed)({
  light: (0, _tokens.token)('color.background.neutral.subtle', 'rgba(255, 255, 255, 0.6)'),
  dark: (0, _tokens.token)('color.background.neutral.subtle', 'rgba(9, 10, 11, 0.29)')
});

var EXPAND_ICON_COLOR = function EXPAND_ICON_COLOR(props) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n"])), (0, _components.themed)({
    light: (0, _tokens.token)('color.icon.subtle', _colors.N80A),
    dark: (0, _tokens.token)('color.icon.subtle', '#d9dde3')
  })(props));
};

var ACTIVE_STATE_BACKGROUND_COLOR = (0, _components.themed)({
  dark: (0, _tokens.token)('color.blanket.selected', "#0C294F4B")
});
var ACTIVE_STATE_BORDER = (0, _components.themed)({
  dark: "1px solid ".concat((0, _tokens.token)('color.border.selected', "#4794ff4B"))
});
var ACTIVE_STATE_BORDER_RADIUS = (0, _components.themed)({
  dark: '3px'
});
var DANGER_STATE_BACKGROUND_COLOR = (0, _components.themed)({
  light: (0, _tokens.token)('color.background.danger', _colors.R50),
  dark: (0, _tokens.token)('color.background.danger', '#441C13')
});
var DANGER_STATE_BORDER = (0, _components.themed)({
  dark: "1px solid ".concat((0, _tokens.token)('color.border.danger', _colors.R200))
});
var DANGER_STATE_BORDER_COLOR = (0, _components.themed)({
  light: (0, _tokens.token)('color.border.danger', _colors.R300)
});
var DANGER_STATE_BORDER_RADIUS = (0, _components.themed)({
  dark: '3px'
});

var expandStyles = function expandStyles(props) {
  return (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  .", " > div {\n    display: flex;\n  }\n\n  .", " {\n    ", "\n    overflow: hidden;\n    cursor: pointer;\n    box-sizing: border-box;\n\n    td > & {\n      margin-top: 0;\n    }\n\n    .", " svg {\n      ", ";\n      transform: rotate(90deg);\n    }\n\n    &.", ":not(.danger) {\n      ", "\n\n      ::after {\n        // Custom background color and borders (for dark theme).\n        background-color: ", ";\n        border: ", ";\n        border-radius: ", ";\n      }\n    }\n\n    &.danger {\n      background: ", ";\n      border: ", ";\n      border-color: ", ";\n      border-radius: ", ";\n    }\n  }\n\n  .ProseMirror\n    > .", ",\n    .", "\n    > .", " {\n    margin-left: -", "px;\n    margin-right: -", "px;\n  }\n\n  .", " {\n    ", "\n    cursor: text;\n    padding-top: 0px;\n  }\n\n  .", " {\n    ", "\n  }\n\n  .", " {\n    ", ";\n    align-items: center;\n    overflow: visible;\n  }\n\n  .", " {\n    background: ", ";\n    border-color: ", ";\n\n    .", " {\n      padding-top: ", "px;\n    }\n  }\n\n  .", " {\n    width: 100%;\n  }\n\n  /* stylelint-disable property-no-unknown, value-keyword-case */\n  .", ":(.", ") {\n    .expand-content-wrapper {\n      height: auto;\n    }\n  }\n  /* stylelint-enable property-no-unknown, value-keyword-case */\n\n  .", ":not(.", ") {\n    .ak-editor-expand__content {\n      position: absolute;\n      height: 1px;\n      width: 1px;\n      overflow: hidden;\n      clip: rect(1px, 1px, 1px, 1px);\n      white-space: nowrap;\n    }\n\n    .", " svg {\n      ", ";\n      transform: rotate(0deg);\n    }\n\n    &:not(.", "):not(.danger) {\n      background: transparent;\n      border-color: transparent;\n\n      &:hover {\n        border-color: ", ";\n        background: ", ";\n      }\n    }\n  }\n"])), _classNames.expandClassNames.icon, _classNames.expandClassNames.prefix, _ui.sharedExpandStyles.containerStyles({
    expanded: false,
    focused: false
  })(props), _classNames.expandClassNames.iconContainer, EXPAND_ICON_COLOR(props), _editorSharedStyles.akEditorSelectedNodeClassName, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.Blanket, _editorSharedStyles.SelectionStyle.Border]), ACTIVE_STATE_BACKGROUND_COLOR(props), ACTIVE_STATE_BORDER(props), ACTIVE_STATE_BORDER_RADIUS(props), DANGER_STATE_BACKGROUND_COLOR(props), DANGER_STATE_BORDER(props), DANGER_STATE_BORDER_COLOR(props), DANGER_STATE_BORDER_RADIUS(props), _classNames.expandClassNames.type('expand'), _constants2.BreakoutCssClassName.BREAKOUT_MARK_DOM, _classNames.expandClassNames.type('expand'), _editorSharedStyles.akLayoutGutterOffset, _editorSharedStyles.akLayoutGutterOffset, _classNames.expandClassNames.content, _ui.sharedExpandStyles.contentStyles({
    expanded: false,
    focused: false
  })(props), _classNames.expandClassNames.titleInput, _ui.sharedExpandStyles.titleInputStyles(props), _classNames.expandClassNames.titleContainer, _ui.sharedExpandStyles.titleContainerStyles(props), _classNames.expandClassNames.expanded, EXPAND_SELECTED_BACKGROUND(props), (0, _components.themed)({
    light: (0, _tokens.token)('color.border', _colors.N40A),
    dark: (0, _tokens.token)('color.border', _colors.DN50)
  })(props), _classNames.expandClassNames.content, (0, _constants.gridSize)(), _classNames.expandClassNames.inputContainer, _classNames.expandClassNames.prefix, _classNames.expandClassNames.expanded, _classNames.expandClassNames.prefix, _classNames.expandClassNames.expanded, _classNames.expandClassNames.iconContainer, EXPAND_ICON_COLOR(props), _editorSharedStyles.akEditorSelectedNodeClassName, (0, _components.themed)({
    light: (0, _tokens.token)('color.border', _colors.N50A),
    dark: (0, _tokens.token)('color.border', _colors.DN50)
  })(props), EXPAND_SELECTED_BACKGROUND(props));
};

exports.expandStyles = expandStyles;