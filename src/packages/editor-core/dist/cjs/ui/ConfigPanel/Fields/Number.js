"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Number;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _form = require("@atlaskit/form");

var _textfield = _interopRequireDefault(require("@atlaskit/textfield"));

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _utils = require("../utils");

var _types = require("../types");

var _isNumber = _interopRequireDefault(require("is-number"));

function Number(_ref) {
  var name = _ref.name,
      field = _ref.field,
      autoFocus = _ref.autoFocus,
      onFieldChange = _ref.onFieldChange,
      placeholder = _ref.placeholder;
  var label = field.label,
      description = field.description,
      defaultValue = field.defaultValue,
      isRequired = field.isRequired;

  function validateNumber(value) {
    var error = (0, _utils.validate)(field, value || '');

    if (error) {
      return error;
    }

    if (value === '') {
      return;
    }

    if ((0, _isNumber.default)(value)) {
      return;
    }

    return _types.ValidationError.Invalid;
  }

  return /*#__PURE__*/_react.default.createElement(_form.Field, {
    name: name,
    label: label,
    defaultValue: defaultValue === undefined ? '' : String(defaultValue),
    isRequired: isRequired,
    validate: validateNumber
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error,
        meta = _ref2.meta;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_textfield.default, (0, _extends2.default)({}, fieldProps, {
      autoFocus: autoFocus,
      onBlur: function onBlur() {
        fieldProps.onBlur();
        onFieldChange(name, meta.dirty);
      },
      type: "text" // do not change this to type="number", it will return invalid strings as ''
      ,
      placeholder: placeholder
    })), /*#__PURE__*/_react.default.createElement(_FieldMessages.default, {
      error: error,
      description: description
    }));
  });
}