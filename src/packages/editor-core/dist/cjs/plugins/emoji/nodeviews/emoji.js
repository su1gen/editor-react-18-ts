"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmojiNodeView = EmojiNodeView;

var _react = _interopRequireDefault(require("react"));

var _Emoji = _interopRequireDefault(require("../ui/Emoji"));

function EmojiNodeView(props) {
  var _props$node$attrs = props.node.attrs,
      shortName = _props$node$attrs.shortName,
      id = _props$node$attrs.id,
      text = _props$node$attrs.text;
  return /*#__PURE__*/_react.default.createElement(_Emoji.default, {
    providers: props.providerFactory,
    id: id,
    shortName: shortName,
    fallback: text
  });
}