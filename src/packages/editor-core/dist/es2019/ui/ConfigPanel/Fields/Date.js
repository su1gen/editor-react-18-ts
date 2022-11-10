import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { injectIntl } from 'react-intl-next';
import { Field } from '@atlaskit/form';
import { DatePicker } from '@atlaskit/datetime-picker';
import FieldMessages from '../FieldMessages';
import { validate } from '../utils';

function Date({
  name,
  field,
  autoFocus,
  onFieldChange,
  placeholder,
  intl
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
    defaultValue: defaultValue,
    isRequired: isRequired,
    validate: value => validate(field, value)
  }, ({
    fieldProps,
    error
  }) => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DatePicker, _extends({}, fieldProps, {
      autoFocus: autoFocus,
      onBlur: () => {
        fieldProps.onBlur();
      },
      onChange: value => {
        fieldProps.onChange(value);
        onFieldChange(name, true);
      },
      locale: intl.locale,
      placeholder: placeholder
    })), /*#__PURE__*/React.createElement(FieldMessages, {
      error: error,
      description: description
    }));
  });
}

export default injectIntl(Date);