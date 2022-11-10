"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _coloredAvatarItem = require("./colored-avatar-item");

var toAvatar = function toAvatar(participant) {
  return {
    name: participant.name,
    src: participant.avatar,
    size: 'medium',
    presence: /*#__PURE__*/_react.default.createElement(_coloredAvatarItem.ColoredAvatarItem, {
      name: participant.name,
      sessionId: participant.sessionId
    })
  };
};

var _default = (0, _memoizeOne.default)(toAvatar, function participantEquals(_ref, _ref2) {
  var _ref3 = (0, _slicedToArray2.default)(_ref, 1),
      a = _ref3[0];

  var _ref4 = (0, _slicedToArray2.default)(_ref2, 1),
      b = _ref4[0];

  return a.name === b.name && a.avatar === b.avatar && a.sessionId === b.sessionId;
});

exports.default = _default;