"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InviteToEditButton = void 0;

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _add = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/add"));

var _ToolbarButton = _interopRequireDefault(require("../../../ui/ToolbarButton"));

var _styles = require("./styles");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @jsx jsx */
var ID = function ID(props) {
  return (0, _react2.jsx)(_react.Fragment, null, props.children);
};

var InviteToEditButton = function InviteToEditButton(props) {
  var Component = props.Component,
      onClick = props.onClick,
      selected = props.selected,
      title = props.title;

  var iconBefore = _react.default.useMemo(function () {
    return (0, _react2.jsx)(_add.default, {
      label: title
    });
  }, [title]);

  if (!Component && !onClick) {
    return null;
  }

  var Wrapper = Component ? Component : ID;
  return (0, _react2.jsx)("div", {
    css: _styles.inviteTeamWrapper
  }, (0, _react2.jsx)(Wrapper, null, (0, _react2.jsx)(_ToolbarButton.default, {
    className: "invite-to-edit",
    onClick: onClick,
    selected: selected,
    title: title,
    titlePosition: "bottom",
    iconBefore: iconBefore
  })));
};

exports.InviteToEditButton = InviteToEditButton;