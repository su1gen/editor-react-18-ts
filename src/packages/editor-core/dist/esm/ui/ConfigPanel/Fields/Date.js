import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { injectIntl } from 'react-intl-next';
import { Field } from '@atlaskit/form';
import { DatePicker } from '@atlaskit/datetime-picker';
import FieldMessages from '../FieldMessages';
import { validate as _validate } from '../utils';

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
  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: label,
    defaultValue: defaultValue,
    isRequired: isRequired,
    validate: function validate(value) {
      return _validate(field, value);
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DatePicker, _extends({}, fieldProps, {
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
    })), /*#__PURE__*/React.createElement(FieldMessages, {
      error: error,
      description: description
    }));
  });
}

export default injectIntl(Date);