"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MentionNodeView = void 0;

var _react = _interopRequireDefault(require("react"));

var _Mention = _interopRequireDefault(require("../ui/Mention"));

var MentionNodeView = function MentionNodeView(props) {
  var providerFactory = props.providerFactory;
  var _props$node$attrs = props.node.attrs,
      id = _props$node$attrs.id,
      text = _props$node$attrs.text,
      accessLevel = _props$node$attrs.accessLevel;
  return /*#__PURE__*/_react.default.createElement(_Mention.default, {
    id: id,
    text: text,
    accessLevel: accessLevel,
    providers: providerFactory
  });
};

exports.MentionNodeView = MentionNodeView;