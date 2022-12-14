/** @jsxRuntime classic */
/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';

import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { BooleanField } from '@atlaskit/editor-common/extensions';
import AKToggle from '@atlaskit/toggle';

import { ValidationError, OnFieldChange } from '../types';
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

function validate(value: boolean | undefined, isRequired: boolean) {
  if (isRequired && !value) {
    return ValidationError.Required;
  }
}

function handleOnChange(
  onChange: (value: boolean) => void,
  onFieldChange: OnFieldChange,
  event: React.ChangeEvent<HTMLInputElement>,
) {
  onChange(event?.target?.checked || false);
  // Note: prior to bumping typescript to version 2.4.2 onFieldChange
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
  onFieldChange,
}: {
  name: string;
  field: BooleanField;
  onFieldChange: OnFieldChange;
}) {
  const {
    label,
    description,
    isRequired = false,
    defaultValue = false,
  } = field;

  return (
    <Field<boolean>
      name={name}
      isRequired={isRequired}
      validate={(value) => validate(value, isRequired)}
      defaultValue={defaultValue}
    >
      {({ fieldProps, error }) => {
        const { value: isChecked, ...restFieldProps } = fieldProps;
        return (
          <Fragment>
            <AKCheckbox
              {...restFieldProps}
              label={label}
              onChange={(event) =>
                handleOnChange(fieldProps.onChange, onFieldChange, event)
              }
              isChecked={isChecked}
            />
            <FieldMessages error={error} description={description} />
          </Fragment>
        );
      }}
    </Field>
  );
}

function Toggle({
  name,
  field,
  onFieldChange,
}: {
  name: string;
  field: BooleanField;
  onFieldChange: OnFieldChange;
}) {
  const {
    label,
    description,
    isRequired = false,
    defaultValue = false,
  } = field;

  return (
    <Field<boolean>
      name={name}
      isRequired={isRequired}
      validate={(value) => validate(value, isRequired)}
      defaultValue={defaultValue}
    >
      {({ fieldProps, error }) => {
        const { id, value: isChecked, ...restFieldProps } = fieldProps;
        return (
          <Fragment>
            <div css={toggleFieldWrapper}>
              <label css={toggleLabel} id={id} htmlFor={id}>
                {label}
                {isRequired ? (
                  <span css={requiredIndicator} aria-hidden="true">
                    *
                  </span>
                ) : null}
              </label>
              <AKToggle
                {...restFieldProps}
                onChange={(event) =>
                  handleOnChange(fieldProps.onChange, onFieldChange, event)
                }
                isChecked={isChecked}
              />
            </div>
            <FieldMessages error={error} description={description} />
          </Fragment>
        );
      }}
    </Field>
  );
}

export default function Boolean({
  name,
  field,
  onFieldChange,
}: {
  name: string;
  field: BooleanField;
  onFieldChange: OnFieldChange;
}) {
  if (field.style === 'toggle') {
    return <Toggle name={name} field={field} onFieldChange={onFieldChange} />;
  }
  return <Checkbox name={name} field={field} onFieldChange={onFieldChange} />;
}
