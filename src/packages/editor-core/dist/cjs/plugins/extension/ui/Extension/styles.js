"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BODIED_EXT_PADDING", {
  enumerable: true,
  get: function get() {
    return _styles.BODIED_EXT_PADDING;
  }
});
exports.overlay = void 0;
Object.defineProperty(exports, "padding", {
  enumerable: true,
  get: function get() {
    return _styles.EXTENSION_PADDING;
  }
});
exports.wrapperDefault = exports.styledImage = exports.placeholderFallbackParams = exports.placeholderFallback = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _components = require("@atlaskit/theme/components");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _styles = require("@atlaskit/editor-common/styles");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

var wrapperDefault = function wrapperDefault(theme) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  border-radius: ", "px;\n  color: ", ";\n  position: relative;\n  vertical-align: middle;\n\n  .ProseMirror-selectednode > span > & > .extension-overlay {\n    box-shadow: inset 0px 0px 0px 2px ", ";\n    opacity: 1;\n  }\n\n  &.with-overlay {\n    .extension-overlay {\n      background: ", ";\n      color: transparent;\n    }\n\n    &:hover .extension-overlay {\n      opacity: 1;\n    }\n  }\n"])), (0, _components.themed)({
    light: (0, _tokens.token)('color.background.neutral', _colors.N20),
    dark: (0, _tokens.token)('color.background.neutral', _colors.DN50)
  })(theme), (0, _constants.borderRadius)(), (0, _components.themed)({
    dark: (0, _tokens.token)('color.text', _colors.DN700)
  })(theme), (0, _tokens.token)('color.border.selected', _colors.B200), (0, _tokens.token)('color.background.neutral.hovered', _colors.N20A));
};

exports.wrapperDefault = wrapperDefault;
var overlay = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  border-radius: ", "px;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.3s;\n"])), (0, _constants.borderRadius)());
exports.overlay = overlay;
var placeholderFallback = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: inline-flex;\n  align-items: center;\n\n  & > img {\n    margin: 0 4px;\n  }\n  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */\n  /* stylelint-disable-next-line */\n  label: placeholder-fallback;\n"])));
exports.placeholderFallback = placeholderFallback;
var placeholderFallbackParams = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  display: inline-block;\n  max-width: 200px;\n  margin-left: 5px;\n  color: ", ";\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n"])), (0, _tokens.token)('color.text.subtlest', _colors.N70));
exports.placeholderFallbackParams = placeholderFallbackParams;
var styledImage = (0, _react.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  max-height: 16px;\n  max-width: 16px;\n  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */\n  /* stylelint-disable-next-line */\n  label: lozenge-image;\n"])));
exports.styledImage = styledImage;