"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTextInput = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _prosemirrorTransform = require("prosemirror-transform");

var isTextInput = function isTextInput(tr) {
  var _tr$steps = (0, _slicedToArray2.default)(tr.steps, 1),
      step = _tr$steps[0];

  if (!step || !(step instanceof _prosemirrorTransform.ReplaceStep)) {
    return false;
  }

  var _ref = step,
      content = _ref.slice.content,
      from = _ref.from,
      to = _ref.to;
  var char = content.firstChild;
  return from === to && content.childCount === 1 && !!char && !!char.text && char.text.length === 1;
};

exports.isTextInput = isTextInput;