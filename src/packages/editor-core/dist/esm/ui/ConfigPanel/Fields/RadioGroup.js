import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React, { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import FieldMessages from '../FieldMessages';
import { FieldTypeError } from '../types';
import { validate as _validate } from '../utils';
export default function RadioField(_ref) {
  var name = _ref.name,
      field = _ref.field,
      onFieldChange = _ref.onFieldChange;

  if (field.isMultiple) {
    return /*#__PURE__*/React.createElement(FieldMessages, {
      error: FieldTypeError.isMultipleAndRadio
    });
  }

  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: field.label,
    defaultValue: field.defaultValue,
    isRequired: field.isRequired,
    validate: function validate(value) {
      return _validate(field, value);
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(RadioGroup, _extends({}, fieldProps, {
      options: (field.items || []).map(function (option) {
        return _objectSpread(_objectSpread({}, option), {}, {
          name: field.name
        });
      }),
      onChange: function onChange(value) {
        fieldProps.onChange(value);
        onFieldChange(field.name, true);
      }
    })), /*#__PURE__*/React.createElement(FieldMessages, {
      error: error
    }));
  });
}