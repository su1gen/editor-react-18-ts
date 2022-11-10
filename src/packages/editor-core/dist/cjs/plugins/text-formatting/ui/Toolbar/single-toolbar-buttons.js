"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleToolbarButtons = void 0;

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _styles = require("../../../../ui/styles");

var _ToolbarButton = _interopRequireDefault(require("../../../../ui/ToolbarButton"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @jsx jsx */
var SingleToolbarButtons = /*#__PURE__*/_react.default.memo(function (_ref) {
  var items = _ref.items,
      isReducedSpacing = _ref.isReducedSpacing,
      editorView = _ref.editorView;
  var onClick = (0, _react.useCallback)(function (command) {
    return function () {
      command(editorView.state, editorView.dispatch);
      return false;
    };
  }, [editorView.state, editorView.dispatch]);
  return (0, _react2.jsx)("span", {
    css: _styles.buttonGroupStyle
  }, items.map(function (item) {
    return (0, _react2.jsx)(_ToolbarButton.default, {
      key: item.key,
      buttonId: item.buttonId,
      spacing: isReducedSpacing ? 'none' : 'default',
      onClick: onClick(item.command),
      selected: item.isActive,
      disabled: item.isDisabled,
      title: item.tooltipElement,
      iconBefore: item.iconElement,
      "aria-pressed": item.isActive,
      "aria-label": String(item.content)
    });
  }));
});

exports.SingleToolbarButtons = SingleToolbarButtons;