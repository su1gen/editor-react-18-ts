"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = exports.FieldTypeError = void 0;
var ValidationError;
exports.ValidationError = ValidationError;

(function (ValidationError) {
  ValidationError["Required"] = "required";
  ValidationError["Invalid"] = "invalid";
})(ValidationError || (exports.ValidationError = ValidationError = {}));

var FieldTypeError;
exports.FieldTypeError = FieldTypeError;

(function (FieldTypeError) {
  FieldTypeError["isMultipleAndRadio"] = "isMultipleAndRadio";
})(FieldTypeError || (exports.FieldTypeError = FieldTypeError = {}));