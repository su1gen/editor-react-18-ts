"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Enum;

var _react = _interopRequireDefault(require("react"));

var _CheckboxGroup = _interopRequireDefault(require("./CheckboxGroup"));

var _RadioGroup = _interopRequireDefault(require("./RadioGroup"));

var _Select = _interopRequireDefault(require("./Select"));

function Enum(_ref) {
  var name = _ref.name,
      field = _ref.field,
      autoFocus = _ref.autoFocus,
      onFieldChange = _ref.onFieldChange,
      fieldDefaultValue = _ref.fieldDefaultValue;

  switch (field.style) {
    case 'checkbox':
      return /*#__PURE__*/_react.default.createElement(_CheckboxGroup.default, {
        name: name,
        field: field,
        onFieldChange: onFieldChange
      });

    case 'radio':
      return /*#__PURE__*/_react.default.createElement(_RadioGroup.default, {
        name: name,
        field: field,
        onFieldChange: onFieldChange
      });

    case 'select':
      return /*#__PURE__*/_react.default.createElement(_Select.default, {
        name: name,
        field: field,
        onFieldChange: onFieldChange,
        placeholder: field.placeholder,
        autoFocus: autoFocus,
        fieldDefaultValue: fieldDefaultValue
      });
  }
}