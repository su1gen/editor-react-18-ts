import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
var _excluded = ["value"],
    _excluded2 = ["id", "value"];

var _templateObject, _templateObject2;

/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import AKToggle from '@atlaskit/toggle';
import { ValidationError } from '../types';
import FieldMessages from '../FieldMessages';
import { requiredIndicator } from './common/RequiredIndicator';
var toggleFieldWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n"])));
var toggleLabel = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  padding: 3px 3px 3px 0px;\n  flex-grow: 1;\n"])));

function _validate(value, isRequired) {
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

function Checkbox(_ref) {
  var name = _ref.name,
      field = _ref.field,
      onFieldChange = _ref.onFieldChange;
  var label = field.label,
      description = field.description,
      _field$isRequired = field.isRequired,
      isRequired = _field$isRequired === void 0 ? false : _field$isRequired,
      _field$defaultValue = field.defaultValue,
      defaultValue = _field$defaultValue === void 0 ? false : _field$defaultValue;
  return jsx(Field, {
    name: name,
    isRequired: isRequired,
    validate: function validate(value) {
      return _validate(value, isRequired);
    },
    defaultValue: defaultValue
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;

    var isChecked = fieldProps.value,
        restFieldProps = _objectWithoutProperties(fieldProps, _excluded);

    return jsx(Fragment, null, jsx(AKCheckbox, _extends({}, restFieldProps, {
      label: label,
      onChange: function onChange(event) {
        return handleOnChange(fieldProps.onChange, onFieldChange, event);
      },
      isChecked: isChecked
    })), jsx(FieldMessages, {
      error: error,
      description: description
    }));
  });
}

function Toggle(_ref3) {
  var name = _ref3.name,
      field = _ref3.field,
      onFieldChange = _ref3.onFieldChange;
  var label = field.label,
      description = field.description,
      _field$isRequired2 = field.isRequired,
      isRequired = _field$isRequired2 === void 0 ? false : _field$isRequired2,
      _field$defaultValue2 = field.defaultValue,
      defaultValue = _field$defaultValue2 === void 0 ? false : _field$defaultValue2;
  return jsx(Field, {
    name: name,
    isRequired: isRequired,
    validate: function validate(value) {
      return _validate(value, isRequired);
    },
    defaultValue: defaultValue
  }, function (_ref4) {
    var fieldProps = _ref4.fieldProps,
        error = _ref4.error;

    var id = fieldProps.id,
        isChecked = fieldProps.value,
        restFieldProps = _objectWithoutProperties(fieldProps, _excluded2);

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
      onChange: function onChange(event) {
        return handleOnChange(fieldProps.onChange, onFieldChange, event);
      },
      isChecked: isChecked
    }))), jsx(FieldMessages, {
      error: error,
      description: description
    }));
  });
}

export default function Boolean(_ref5) {
  var name = _ref5.name,
      field = _ref5.field,
      onFieldChange = _ref5.onFieldChange;

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