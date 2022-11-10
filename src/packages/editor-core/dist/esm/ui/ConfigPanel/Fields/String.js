import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["onChange"];
import React, { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';
import FieldMessages from '../FieldMessages';
import { validate as _validate } from '../utils';
export default function String(_ref) {
  var name = _ref.name,
      field = _ref.field,
      autoFocus = _ref.autoFocus,
      onFieldChange = _ref.onFieldChange,
      placeholder = _ref.placeholder;
  var label = field.label,
      description = field.description,
      defaultValue = field.defaultValue,
      isRequired = field.isRequired;
  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: label,
    defaultValue: defaultValue || '',
    isRequired: isRequired,
    validate: function validate(value) {
      return _validate(field, value || '');
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error,
        meta = _ref2.meta;

    if (field.style === 'multiline') {
      var _onChange = fieldProps.onChange,
          restFieldProps = _objectWithoutProperties(fieldProps, _excluded);

      var options = field.options;
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(TextArea, _extends({}, restFieldProps, options, {
        onChange: function onChange(e) {
          return _onChange(e.currentTarget.value);
        },
        onBlur: function onBlur() {
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
      onBlur: function onBlur() {
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