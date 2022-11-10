import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import AKToggle from '@atlaskit/toggle';
import { ValidationError } from '../types';
import FieldMessages from '../FieldMessages';
import { requiredIndicator } from './common/RequiredIndicator';
const toggleFieldWrapper = css`
  display: flex;
`;
const toggleLabel = css`
  display: flex;
  padding: 3px 3px 3px 0px;
  flex-grow: 1;
`;

function validate(value, isRequired) {
  if (isRequired && !value) {
    return ValidationError.Required;
  }
}

function handleOnChange(onChange, onFieldChange, event) {
  var _event$target;

  onChange((event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.checked) || false); // Note: prior to bumping typescript to version 2.4.2 onFieldChange
  // was being called with a global variable (which had a value of '')
  // While this was not intended, the code still worked as expected.
  // In typescript 2.4.2 accessing the global variable name has been
  // deprecated, so this has been replaced with the value it was
  // previously passing.

  onFieldChange('', true);
}

function Checkbox({
  name,
  field,
  onFieldChange
}) {
  const {
    label,
    description,
    isRequired = false,
    defaultValue = false
  } = field;
  return jsx(Field, {
    name: name,
    isRequired: isRequired,
    validate: value => validate(value, isRequired),
    defaultValue: defaultValue
  }, ({
    fieldProps,
    error
  }) => {
    const {
      value: isChecked,
      ...restFieldProps
    } = fieldProps;
    return jsx(Fragment, null, jsx(AKCheckbox, _extends({}, restFieldProps, {
      label: label,
      onChange: event => handleOnChange(fieldProps.onChange, onFieldChange, event),
      isChecked: isChecked
    })), jsx(FieldMessages, {
      error: error,
      description: description
    }));
  });
}

function Toggle({
  name,
  field,
  onFieldChange
}) {
  const {
    label,
    description,
    isRequired = false,
    defaultValue = false
  } = field;
  return jsx(Field, {
    name: name,
    isRequired: isRequired,
    validate: value => validate(value, isRequired),
    defaultValue: defaultValue
  }, ({
    fieldProps,
    error
  }) => {
    const {
      id,
      value: isChecked,
      ...restFieldProps
    } = fieldProps;
    return jsx(Fragment, null, jsx("div", {
      css: toggleFieldWrapper
    }, jsx("label", {
      css: toggleLabel,
      id: id,
      htmlFor: id
    }, label, isRequired ? jsx("span", {
      css: requiredIndicator,
      "aria-hidden": "true"
    }, "*") : null), jsx(AKToggle, _extends({}, restFieldProps, {
      onChange: event => handleOnChange(fieldProps.onChange, onFieldChange, event),
      isChecked: isChecked
    }))), jsx(FieldMessages, {
      error: error,
      description: description
    }));
  });
}

export default function Boolean({
  name,
  field,
  onFieldChange
}) {
  if (field.style === 'toggle') {
    return jsx(Toggle, {
      name: name,
      field: field,
      onFieldChange: onFieldChange
    });
  }

  return jsx(Checkbox, {
    name: name,
    field: field,
    onFieldChange: onFieldChange
  });
}