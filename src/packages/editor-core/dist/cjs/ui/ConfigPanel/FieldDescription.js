"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _form = require("@atlaskit/form");

var FieldDescription = function FieldDescription(_ref) {
  var error = _ref.error,
      description = _ref.description;

  if (error || !description) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_form.HelperMessage, null, description);
};

var _default = FieldDescription;
exports.default = _default;