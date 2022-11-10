"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorLinkPicker = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _linkPicker = require("@atlaskit/link-picker");

var _actions = require("../../../card/pm-plugins/actions");

var _commands = require("../../commands");

var _useEscapeClickaway = require("./useEscapeClickaway");

var _excluded = ["view"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var EditorLinkPicker = function EditorLinkPicker(_ref) {
  var view = _ref.view,
      restProps = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  var onEscape = (0, _react.useCallback)(function () {
    (0, _commands.hideLinkToolbar)()(view.state, view.dispatch);
    view.dispatch((0, _actions.hideLinkToolbar)(view.state.tr));
  }, [view]);
  var onClickAway = (0, _react.useCallback)(function () {
    (0, _commands.hideLinkToolbar)()(view.state, view.dispatch);
  }, [view]);
  var ref = (0, _useEscapeClickaway.useEscapeClickaway)(onEscape, onClickAway);
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: ref
  }, /*#__PURE__*/_react.default.createElement(_linkPicker.LinkPicker, (0, _extends2.default)({}, restProps, {
    onCancel: onEscape
  })));
};

exports.EditorLinkPicker = EditorLinkPicker;