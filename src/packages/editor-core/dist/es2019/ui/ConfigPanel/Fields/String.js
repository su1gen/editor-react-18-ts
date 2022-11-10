import _extends from "@babel/runtime/helpers/extends";
import React, { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';
import FieldMessages from '../FieldMessages';
import { validate } from '../utils';
export default function String({
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
  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: label,
    defaultValue: defaultValue || '',
    isRequired: isRequired,
    validate: value => validate(field, value || '')
  }, ({
    fieldProps,
    error,
    meta
  }) => {
    if (field.style === 'multiline') {
      const {
        onChange,
        ...restFieldProps
      } = fieldProps;
      const {
        options
      } = field;
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(TextArea, _extends({}, restFieldProps, options, {
        onChange: e => onChange(e.currentTarget.value),
        onBlur: () => {
          fieldProps.onBlur();
          onFieldChange(name, meta.dirty);
        },
        placeholder: placeholder
      })), /*#__PURE__*/React.createElement(FieldMessages, {
        error: error,
        description: description
      }));
    }

    return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(TextField, _extends({}, fieldProps, {
      type: "text",
      autoFocus: autoFocus,
      onBlur: () => {
        fieldProps.onBlur();
        onFieldChange(name, meta.dirty);
      },
      placeholder: placeholder
    })), /*#__PURE__*/React.createElement(FieldMessages, {
      error: error,
      description: description
    }));
  });
}