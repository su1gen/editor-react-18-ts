import _extends from "@babel/runtime/helpers/extends";
import React, { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';
import FieldMessages from '../FieldMessages';
import { validate as _validate, getOptionFromValue } from '../utils';
import { formatOptionLabel } from './SelectItem';
export default function SelectField(_ref) {
  var name = _ref.name,
      field = _ref.field,
      onFieldChange = _ref.onFieldChange,
      autoFocus = _ref.autoFocus,
      placeholder = _ref.placeholder,
      fieldDefaultValue = _ref.fieldDefaultValue;
  //ignore arrays as mutli-value select fields are always clearable
  var hasValidSingleDefaultValue = !Array.isArray(fieldDefaultValue) && fieldDefaultValue !== undefined;
  var isClearable = !hasValidSingleDefaultValue || field.isMultiple;
  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: field.label,
    defaultValue: getOptionFromValue(field.items, field.defaultValue),
    isRequired: field.isRequired,
    validate: function validate(value) {
      return _validate(field, value);
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Select, _extends({}, fieldProps, {
      onChange: function onChange(value) {
        fieldProps.onChange(value);
        onFieldChange(name, true);
      } // @see DST-2386 & ED-12503
      ,
      enableAnimation: false // add type cast to avoid adding a "IsMulti" generic prop (TODO: ED-12072)
      ,
      isMulti: field.isMultiple || false,
      options: field.items || [],
      isClearable: isClearable,
      validationState: error ? 'error' : 'default',
      formatOptionLabel: formatOptionLabel,
      autoFocus: autoFocus,
      menuPlacement: "auto",
      placeholder: placeholder
    })), /*#__PURE__*/React.createElement(FieldMessages, {
      error: error,
      description: field.description
    }));
  });
}