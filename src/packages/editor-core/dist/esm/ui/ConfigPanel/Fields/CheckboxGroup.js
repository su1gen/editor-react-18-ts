import _extends from "@babel/runtime/helpers/extends";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
var _excluded = ["onChange", "value"];

var _templateObject;

/** @jsx jsx */
import { Fragment, useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import { Field, Fieldset as AKFieldset } from '@atlaskit/form';
import { token } from '@atlaskit/tokens';
import { ValidationError } from '../types';
import FieldMessages from '../FieldMessages';

function _validate(value, isRequired) {
  if (isRequired && !(value !== null && value !== void 0 && value.length)) {
    return ValidationError.Required;
  }
}

var requiredIndicator = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  color: ", ";\n"])), token('color.text.danger', '#bf2600'));

function CheckboxGroupInner(_ref) {
  var label = _ref.label,
      description = _ref.description,
      onFieldChange = _ref.onFieldChange,
      options = _ref.options,
      error = _ref.error,
      fieldProps = _ref.fieldProps;

  var onChange = fieldProps.onChange,
      value = fieldProps.value,
      restFieldProps = _objectWithoutProperties(fieldProps, _excluded);

  function _onChange(optionValue, isChecked) {
    var active = new Set(value ? value : []);

    if (isChecked) {
      active.add(optionValue);
    } else {
      active.delete(optionValue);
    }

    onChange(_toConsumableArray(active));
    onFieldChange();
  }

  return jsx(Fragment, null, jsx(AKFieldset, {
    legend: label
  }, options.map(function (_ref2, i) {
    var optionLabel = _ref2.label,
        optionValue = _ref2.value;
    var isChecked = value && value.includes(optionValue);

    var onOptionChange = function onOptionChange(event) {
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

export default function CheckboxGroup(_ref3) {
  var name = _ref3.name,
      field = _ref3.field,
      onFieldChange = _ref3.onFieldChange;
  var labelBase = field.label,
      description = field.description,
      defaultValue = field.defaultValue,
      _field$isRequired = field.isRequired,
      isRequired = _field$isRequired === void 0 ? false : _field$isRequired,
      options = field.items;
  var label = jsx(Fragment, null, labelBase, isRequired ? jsx("span", {
    css: requiredIndicator,
    "aria-hidden": "true"
  }, ' ', "*") : null);

  var _onFieldChange = useCallback(function () {
    onFieldChange(name, true);
  }, [name, onFieldChange]);

  return jsx(Field, {
    name: name,
    isRequired: isRequired,
    defaultValue: defaultValue,
    validate: function validate(value) {
      return _validate(value, isRequired);
    }
  }, function (props) {
    return jsx(CheckboxGroupInner, _extends({
      label: label,
      description: description,
      options: options,
      onFieldChange: _onFieldChange
    }, props));
  });
}