import React from 'react';
import CheckboxGroup from './CheckboxGroup';
import RadioGroup from './RadioGroup';
import Select from './Select';
export default function Enum(_ref) {
  var name = _ref.name,
      field = _ref.field,
      autoFocus = _ref.autoFocus,
      onFieldChange = _ref.onFieldChange,
      fieldDefaultValue = _ref.fieldDefaultValue;

  switch (field.style) {
    case 'checkbox':
      return /*#__PURE__*/React.createElement(CheckboxGroup, {
        name: name,
        field: field,
        onFieldChange: onFieldChange
      });

    case 'radio':
      return /*#__PURE__*/React.createElement(RadioGroup, {
        name: name,
        field: field,
        onFieldChange: onFieldChange
      });

    case 'select':
      return /*#__PURE__*/React.createElement(Select, {
        name: name,
        field: field,
        onFieldChange: onFieldChange,
        placeholder: field.placeholder,
        autoFocus: autoFocus,
        fieldDefaultValue: fieldDefaultValue
      });
  }
}