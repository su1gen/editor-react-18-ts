"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputSource = void 0;

var _enums = require("../analytics/types/enums");

var InputSource;
exports.InputSource = InputSource;

(function (InputSource) {
  InputSource[InputSource["TOOLBAR"] = _enums.INPUT_METHOD.TOOLBAR] = "TOOLBAR";
  InputSource[InputSource["KEYBOARD"] = _enums.INPUT_METHOD.KEYBOARD] = "KEYBOARD";
})(InputSource || (exports.InputSource = InputSource = {}));