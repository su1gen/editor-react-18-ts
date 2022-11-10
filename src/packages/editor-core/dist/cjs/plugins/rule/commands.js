"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertHorizontalRule = void 0;

var _inputRule = require("./pm-plugins/input-rule");

var insertHorizontalRule = function insertHorizontalRule(inputMethod) {
  return function (state, dispatch) {
    var tr = (0, _inputRule.createHorizontalRule)(state, state.selection.from, state.selection.to, inputMethod);

    if (tr) {
      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};

exports.insertHorizontalRule = insertHorizontalRule;