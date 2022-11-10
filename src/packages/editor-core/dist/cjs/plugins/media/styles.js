"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _styles = require("@atlaskit/editor-common/styles");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _colors = require("@atlaskit/theme/colors");

var _mediaCard = require("@atlaskit/media-card");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var mediaStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror {\n    ", " & [layout='full-width'] .", ",\n    & [layout='wide'] .", " {\n      margin-left: 50%;\n      transform: translateX(-50%);\n    }\n\n    & [layout^='wrap-'] + [layout^='wrap-'] {\n      clear: none;\n      & + p,\n      & + div[class^='fabric-editor-align'],\n      & + ul,\n      & + ol,\n      & + h1,\n      & + h2,\n      & + h3,\n      & + h4,\n      & + h5,\n      & + h6 {\n        clear: both !important;\n      }\n      & .", " {\n        margin-left: 0;\n        margin-right: 0;\n      }\n    }\n\n    .mediaSingleView-content-wrap[layout^='wrap-'] {\n      max-width: 100%;\n      // overwrite default Prosemirror setting making it clear: both\n      clear: inherit;\n    }\n\n    .mediaSingleView-content-wrap[layout='wrap-left'] {\n      float: left;\n    }\n\n    .mediaSingleView-content-wrap[layout='wrap-right'] {\n      float: right;\n    }\n\n    .mediaSingleView-content-wrap[layout='wrap-right']\n      + .mediaSingleView-content-wrap[layout='wrap-left'] {\n      clear: both;\n    }\n\n    /* Larger margins for resize handlers when at depth 0 of the document */\n    & > .mediaSingleView-content-wrap {\n      .richMedia-resize-handle-right {\n        margin-right: -", "px;\n      }\n      .richMedia-resize-handle-left {\n        margin-left: -", "px;\n      }\n    }\n  }\n\n  .richMedia-resize-handle-right,\n  .richMedia-resize-handle-left {\n    display: flex;\n    flex-direction: column;\n\n    /* vertical align */\n    justify-content: center;\n  }\n\n  .richMedia-resize-handle-right {\n    align-items: flex-end;\n    padding-right: 12px;\n    margin-right: -", "px;\n  }\n\n  .richMedia-resize-handle-left {\n    align-items: flex-start;\n    padding-left: 12px;\n    margin-left: -", "px;\n  }\n\n  .richMedia-resize-handle-right::after,\n  .richMedia-resize-handle-left::after {\n    content: ' ';\n    display: flex;\n    width: 3px;\n    height: 64px;\n\n    border-radius: 6px;\n  }\n\n  .", ":hover .richMedia-resize-handle-left::after,\n  .", ":hover .richMedia-resize-handle-right::after {\n    background: ", ";\n  }\n\n  .", " .richMedia-resize-handle-right::after,\n  .", " .richMedia-resize-handle-left::after,\n  .", " .richMedia-resize-handle-right:hover::after,\n  .", " .richMedia-resize-handle-left:hover::after,\n  .", ".is-resizing .richMedia-resize-handle-right::after,\n  .", ".is-resizing .richMedia-resize-handle-left::after {\n    background: ", ";\n  }\n\n  .__resizable_base__ {\n    left: unset !important;\n    width: auto !important;\n    height: auto !important;\n  }\n\n  /* Danger when top level node for smart cards / inline links */\n  .danger > div > div > .media-card-frame,\n  .danger > span > a {\n    background-color: ", ";\n    box-shadow: 0px 0px 0px ", "px\n      ", ";\n    transition: background-color 0s, box-shadow 0s;\n  }\n  .mediaGroupView-content-wrap.danger {\n    /* Media inline */\n    .", "::after {\n      border: 1px solid ", ";\n    }\n  }\n  /* Danger when nested node or common */\n  .danger {\n    /* Media single */\n    .", " .", "::after {\n      border: 1px solid ", ";\n    }\n    /* Media single video player */\n    .", " .", "::after {\n      border: 1px solid ", ";\n    }\n    /* New file experience */\n    .", " .", " {\n      box-shadow: 0 0 0 1px\n        ", " !important;\n    }\n    /* Media resize handlers */\n    .richMedia-resize-handle-right::after,\n    .richMedia-resize-handle-left::after {\n      background: ", ";\n    }\n\n    /* Smart cards */\n    div div .media-card-frame,\n    .inlineCardView-content-wrap > span > a {\n      background-color: ", "; /* R75 with 50% opactiy */\n      transition: background-color 0s;\n    }\n\n    div div .media-card-frame::after {\n      box-shadow: none;\n    }\n  }\n"])), _styles.mediaSingleSharedStyle, _styles.richMediaClassName, _styles.richMediaClassName, _styles.richMediaClassName, _editorSharedStyles.akEditorMediaResizeHandlerPaddingWide, _editorSharedStyles.akEditorMediaResizeHandlerPaddingWide, _editorSharedStyles.akEditorMediaResizeHandlerPadding, _editorSharedStyles.akEditorMediaResizeHandlerPadding, _styles.richMediaClassName, _styles.richMediaClassName, (0, _tokens.token)('color.border', _colors.N60), _editorSharedStyles.akEditorSelectedNodeClassName, _editorSharedStyles.akEditorSelectedNodeClassName, _styles.richMediaClassName, _styles.richMediaClassName, _styles.richMediaClassName, _styles.richMediaClassName, (0, _tokens.token)('color.border.focused', _colors.B200), (0, _tokens.token)('color.background.danger', _editorSharedStyles.akEditorDeleteBackground), _editorSharedStyles.akEditorSelectedBorderBoldSize, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder), _mediaCard.fileCardImageViewSelectedSelector, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteIconColor), _styles.richMediaClassName, _mediaCard.fileCardImageViewSelector, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteIconColor), _styles.richMediaClassName, _mediaCard.inlinePlayerClassName, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteIconColor), _styles.richMediaClassName, _mediaCard.newFileExperienceClassName, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteIconColor), (0, _tokens.token)('color.icon.danger', _editorSharedStyles.akEditorDeleteIconColor), (0, _tokens.token)('color.blanket.danger', 'rgb(255, 189, 173, 0.5)'));
/* `left: unset` above is to work around Chrome bug where rendering a div with
 * that style applied inside a container that has a scroll, causes any svgs on
 * the page, without a border, that are inside a flexbox, to no longer align to
 * the center of their viewbox.
 *
 * for us, this means that all the toolbar icons start jumping around if
 * you make the viewport small
 */

exports.mediaStyles = mediaStyles;