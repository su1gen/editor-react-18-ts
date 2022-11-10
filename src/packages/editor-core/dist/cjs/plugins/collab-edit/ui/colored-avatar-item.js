"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColoredAvatarItem = void 0;

var _react = require("@emotion/react");

var _utils = require("../utils");

var _styles = require("./styles");

/** @jsx jsx */
var ColoredAvatarItem = function ColoredAvatarItem(props) {
  var color = (0, _utils.getAvatarColor)(props.sessionId).color.solid;
  var avatar = props.name.substr(0, 1).toUpperCase();
  return (0, _react.jsx)("div", {
    css: (0, _styles.badge)(color),
    "data-testid": "editor-collab-badge"
  }, avatar);
};

exports.ColoredAvatarItem = ColoredAvatarItem;