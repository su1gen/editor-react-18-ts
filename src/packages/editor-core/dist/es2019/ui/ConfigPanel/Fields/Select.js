import _extends from "@babel/runtime/helpers/extends";
import React, { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';
import FieldMessages from '../FieldMessages';
import { validate, getOptionFromValue } from '../utils';
import { formatOptionLabel } from './SelectItem';
export default function SelectField({
  name,
  field,
  onFieldChange,
  autoFocus,
  placeholder,
  fieldDefaultValue
}) {
  //ignore arrays as mutli-value select fields are always clearable
  const hasValidSingleDefaultValue = !Array.isArray(fieldDefaultValue) && fieldDefaultValue !== undefined;
  const isClearable = !hasValidSingleDefaultValue || field.isMultiple;
  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: field.label,
    defaultValue: getOptionFromValue(field.items, field.defaultValue),
    isRequired: field.isRequired,
    validate: value => {
      return validate(field, value);
    }
  }, ({
    fieldProps,
    error
  }) => /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Select, _extends({}, fieldProps, {
    onChange: value => {
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
  })));
}