import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import FieldMessages from '../FieldMessages';
import { validate } from '../utils';
import { ValidationError } from '../types';
import isNumber from 'is-number';
export default function Number({
  name,
  field,
  autoFocus,
  onFieldChange,
  placeholder
}) {
  const {
    label,
    description,
    defaultValue,
    isRequired
  } = field;

  function validateNumber(value) {
    const error = validate(field, value || '');

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
  }, ({
    fieldProps,
    error,
    meta
  }) => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextField, _extends({}, fieldProps, {
      autoFocus: autoFocus,
      onBlur: () => {
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