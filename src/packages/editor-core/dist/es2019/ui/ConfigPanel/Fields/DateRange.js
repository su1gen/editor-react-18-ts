import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { Fragment, useState, useEffect, useMemo } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import { DatePicker } from '@atlaskit/datetime-picker';
import TextField from '@atlaskit/textfield';
import { messages } from '../messages';
import FieldMessages from '../FieldMessages';
import { validate, validateRequired } from '../utils';
const horizontalFields = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const horizontalFieldWrapper = css`
  flex-basis: 47%;
`;
const hidden = css`
  display: none;
`;

const getFromDefaultValue = (field, attribute) => {
  if (field.defaultValue) {
    return field.defaultValue[attribute];
  }
};

const DateField = ({
  parentField,
  scope,
  fieldName,
  onFieldChange,
  intl,
  isRequired
}) => jsx("div", {
  css: horizontalFieldWrapper,
  key: fieldName
}, jsx(Field, {
  name: `${scope}.${fieldName}`,
  label: intl.formatMessage(messages[fieldName]),
  defaultValue: getFromDefaultValue(parentField, fieldName),
  isRequired: isRequired,
  validate: value => {
    return validateRequired({
      isRequired
    }, value);
  }
}, ({
  fieldProps,
  error
}) => jsx(Fragment, null, jsx(DatePicker, _extends({}, fieldProps, {
  onChange: date => {
    fieldProps.onChange(date);
    onFieldChange(parentField.name, true);
  },
  locale: intl.locale
})), jsx(FieldMessages, {
  error: error
}))));

const DateRange = function ({
  name,
  field,
  onFieldChange,
  intl
}) {
  const items = useMemo(() => {
    return [...(field.items || []), {
      label: intl.formatMessage(messages.custom),
      value: 'custom'
    }].map(option => ({ ...option,
      name
    }));
  }, [field.items, name, intl]);
  const [currentValue, setCurrentValue] = useState(getFromDefaultValue(field, 'value') || items[0].value);
  useEffect(() => {
    // calling onBlur here based on the currentValue changing will ensure that we
    // get the most up to date value after the form has been rendered
    onFieldChange(name, true);
  }, [currentValue, onFieldChange, name]);
  const element = jsx(Fragment, null, jsx("div", {
    css: hidden
  }, jsx(Field, {
    name: `${name}.type`,
    defaultValue: 'date-range'
  }, ({
    fieldProps
  }) => jsx(TextField, _extends({}, fieldProps, {
    type: "hidden"
  })))), jsx(Field, {
    name: `${name}.value`,
    label: field.label,
    defaultValue: currentValue,
    isRequired: field.isRequired,
    validate: value => validate(field, value || '')
  }, ({
    fieldProps,
    error
  }) => jsx(Fragment, null, jsx(RadioGroup, _extends({}, fieldProps, {
    options: items,
    onChange: event => {
      fieldProps.onChange(event.target.value);
      setCurrentValue(event.target.value);
    }
  })), jsx(FieldMessages, {
    error: error
  }))), currentValue !== 'custom' ? jsx("div", {
    css: hidden
  }, jsx(Field, {
    name: `${name}.from`,
    defaultValue: currentValue
  }, ({
    fieldProps
  }) => jsx(TextField, _extends({}, fieldProps, {
    type: "hidden"
  })))) : jsx("div", {
    css: horizontalFields
  }, jsx(DateField, {
    scope: name,
    parentField: field,
    fieldName: "from",
    onFieldChange: onFieldChange,
    intl: intl,
    isRequired: field.isRequired
  }), jsx(DateField, {
    scope: name,
    parentField: field,
    fieldName: "to",
    onFieldChange: onFieldChange,
    intl: intl,
    isRequired: field.isRequired
  })), jsx(FieldMessages, {
    description: field.description
  }));
  return element;
};

export default injectIntl(DateRange);