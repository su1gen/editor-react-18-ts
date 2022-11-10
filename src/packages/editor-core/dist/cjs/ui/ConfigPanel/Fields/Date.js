"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _form = require("@atlaskit/form");

var _datetimePicker = require("@atlaskit/datetime-picker");

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _utils = require("../utils");

function Date(_ref) {
  var name = _ref.name,
      field = _ref.field,
      autoFocus = _ref.autoFocus,
      onFieldChange = _ref.onFieldChange,
      placeholder = _ref.placeholder,
      intl = _ref.intl;
  var label = field.label,
      description = field.description,
      defaultValue = field.defaultValue,
      isRequired = field.isRequired;
  return /*#__PURE__*/_react.default.createElement(_form.Field, {
    name: name,
    label: label,
    defaultValue: defaultValue,
    isRequired: isRequired,
    validate: function validate(value) {
      return (0, _utils.validate)(field, value);
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_datetimePicker.DatePicker, (0, _extends2.default)({}, fieldProps, {
      autoFocus: autoFocus,
      onBlur: function onBlur() {
        fieldProps.onBlur();
      },
      onChange: function onChange(value) {
        fieldProps.onChange(value);
        onFieldChange(name, true);
      },
      locale: intl.locale,
      placeholder: placeholder
    })), /*#__PURE__*/_react.default.createElement(_FieldMessages.default, {
      error: error,
      description: description
    }));
  });
}

var _default = (0, _reactIntlNext.injectIntl)(Date);

exports.default = _default;