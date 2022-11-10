import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import FieldMessages from '../FieldMessages';
import { validate } from '../utils';
import { ValidationError } from '../types';
import isNumber from 'is-number';
export default function Number(_ref) {
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
    var error = validate(field, value || '');

    if (error) {
      return error;
    }

    if (value === '') {
      return;
    }

    if (isNumber(value)) {
      return;
    }

    return ValidationError.Invalid;
  }

  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: label,
    defaultValue: defaultValue === undefined ? '' : String(defaultValue),
    isRequired: isRequired,
    validate: validateNumber
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error,
        meta = _ref2.meta;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextField, _extends({}, fieldProps, {
      autoFocus: autoFocus,
      onBlur: function onBlur() {
        fieldProps.onBlur();
        onFieldChange(name, meta.dirty);
      },
      type: "text" // do not change this to type="number", it will return invalid strings as ''
      ,
      placeholder: placeholder
    })), /*#__PURE__*/React.createElement(FieldMessages, {
      error: error,
      description: description
    }));
  });
}