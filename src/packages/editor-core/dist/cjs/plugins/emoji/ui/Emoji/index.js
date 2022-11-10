"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EmojiNode;

var _react = require("@emotion/react");

var _styles = require("../../../../ui/styles");

var _emoji = require("@atlaskit/editor-common/emoji");

/** @jsx jsx */
function EmojiNode(props) {
  return (0, _react.jsx)("span", {
    css: _styles.clickSelectWrapperStyle
  }, (0, _react.jsx)(_emoji.Emoji, props));
}