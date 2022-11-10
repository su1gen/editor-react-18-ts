import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { Fragment, useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field, Fieldset as AKFieldset } from '@atlaskit/form';
import { token } from '@atlaskit/tokens';
import { ValidationError } from '../types';
import FieldMessages from '../FieldMessages';

function validate(value, isRequired) {
  if (isRequired && !(value !== null && value !== void 0 && value.length)) {
    return ValidationError.Required;
  }
}

const requiredIndicator = css`
  color: ${token('color.text.danger', '#bf2600')};
`;

function CheckboxGroupInner({
  label,
  description,
  onFieldChange,
  options,
  error,
  fieldProps
}) {
  const {
    onChange,
    value,
    ...restFieldProps
  } = fieldProps;

  function _onChange(optionValue, isChecked) {
    const active = new Set(value ? value : []);

    if (isChecked) {
      active.add(optionValue);
    } else {
      active.delete(optionValue);
    }

    onChange([...active]);
    onFieldChange();
  }

  return jsx(Fragment, null, jsx(AKFieldset, {
    legend: label
  }, options.map(({
    label: optionLabel,
    value: optionValue
  }, i) => {
    const isChecked = value && value.includes(optionValue);

    const onOptionChange = event => {
      _onChange(optionValue, event.target.checked);
    };

    return jsx(AKCheckbox, _extends({
      key: i
    }, restFieldProps, {
      isRequired: false,
      label: optionLabel,
      isChecked: isChecked,
      onChange: onOptionChange
    }));
  })), jsx(FieldMessages, {
    error: error,
    description: description
  }));
}

export default function CheckboxGroup({
  name,
  field,
  onFieldChange
}) {
  const {
    label: labelBase,
    description,
    defaultValue,
    isRequired = false,
    items: options
  } = field;
  const label = jsx(Fragment, null, labelBase, isRequired ? jsx("span", {
    css: requiredIndicator,
    "aria-hidden": "true"
  }, ' ', "*") : null);

  const _onFieldChange = useCallback(() => {
    onFieldChange(name, true);
  }, [name, onFieldChange]);

  return jsx(Field, {
    name: name,
    isRequired: isRequired,
    defaultValue: defaultValue,
    validate: value => validate(value, isRequired)
  }, props => {
    return jsx(CheckboxGroupInner, _extends({
      label: label,
      description: description,
      options: options,
      onFieldChange: _onFieldChange
    }, props));
  });
}