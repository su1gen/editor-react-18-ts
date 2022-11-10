import _extends from "@babel/runtime/helpers/extends";
import React, { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import FieldMessages from '../FieldMessages';
import { FieldTypeError } from '../types';
import { validate } from '../utils';
export default function RadioField({
  name,
  field,
  onFieldChange
}) {
  if (field.isMultiple) {
    return /*#__PURE__*/React.createElement(FieldMessages, {
      error: FieldTypeError.isMultipleAndRadio
    });
  }

  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: field.label,
    defaultValue: field.defaultValue,
    isRequired: field.isRequired,
    validate: value => validate(field, value)
  }, ({
    fieldProps,
    error
  }) => /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(RadioGroup, _extends({}, fieldProps, {
    options: (field.items || []).map(option => ({ ...option,
      name: field.name
    })),
    onChange: value => {
      fieldProps.onChange(value);
      onFieldChange(field.name, true);
    }
  })), /*#__PURE__*/React.createElement(FieldMessages, {
    error: error
  })));
}