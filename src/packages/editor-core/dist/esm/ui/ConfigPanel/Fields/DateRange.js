import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _extends from "@babel/runtime/helpers/extends";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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
import { validate as _validate, validateRequired } from '../utils';
var horizontalFields = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n"])));
var horizontalFieldWrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex-basis: 47%;\n"])));
var hidden = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: none;\n"])));

var getFromDefaultValue = function getFromDefaultValue(field, attribute) {
  if (field.defaultValue) {
    return field.defaultValue[attribute];
  }
};

var DateField = function DateField(_ref) {
  var parentField = _ref.parentField,
      scope = _ref.scope,
      fieldName = _ref.fieldName,
      onFieldChange = _ref.onFieldChange,
      intl = _ref.intl,
      isRequired = _ref.isRequired;
  return jsx("div", {
    css: horizontalFieldWrapper,
    key: fieldName
  }, jsx(Field, {
    name: "".concat(scope, ".").concat(fieldName),
    label: intl.formatMessage(messages[fieldName]),
    defaultValue: getFromDefaultValue(parentField, fieldName),
    isRequired: isRequired,
    validate: function validate(value) {
      return validateRequired({
        isRequired: isRequired
      }, value);
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return jsx(Fragment, null, jsx(DatePicker, _extends({}, fieldProps, {
      onChange: function onChange(date) {
        fieldProps.onChange(date);
        onFieldChange(parentField.name, true);
      },
      locale: intl.locale
    })), jsx(FieldMessages, {
      error: error
    }));
  }));
};

var DateRange = function DateRange(_ref3) {
  var name = _ref3.name,
      field = _ref3.field,
      onFieldChange = _ref3.onFieldChange,
      intl = _ref3.intl;
  var items = useMemo(function () {
    return [].concat(_toConsumableArray(field.items || []), [{
      label: intl.formatMessage(messages.custom),
      value: 'custom'
    }]).map(function (option) {
      return _objectSpread(_objectSpread({}, option), {}, {
        name: name
      });
    });
  }, [field.items, name, intl]);

  var _useState = useState(getFromDefaultValue(field, 'value') || items[0].value),
      _useState2 = _slicedToArray(_useState, 2),
      currentValue = _useState2[0],
      setCurrentValue = _useState2[1];

  useEffect(function () {
    // calling onBlur here based on the currentValue changing will ensure that we
    // get the most up to date value after the form has been rendered
    onFieldChange(name, true);
  }, [currentValue, onFieldChange, name]);
  var element = jsx(Fragment, null, jsx("div", {
    css: hidden
  }, jsx(Field, {
    name: "".concat(name, ".type"),
    defaultValue: 'date-range'
  }, function (_ref4) {
    var fieldProps = _ref4.fieldProps;
    return jsx(TextField, _extends({}, fieldProps, {
      type: "hidden"
    }));
  })), jsx(Field, {
    name: "".concat(name, ".value"),
    label: field.label,
    defaultValue: currentValue,
    isRequired: field.isRequired,
    validate: function validate(value) {
      return _validate(field, value || '');
    }
  }, function (_ref5) {
    var fieldProps = _ref5.fieldProps,
        error = _ref5.error;
    return jsx(Fragment, null, jsx(RadioGroup, _extends({}, fieldProps, {
      options: items,
      onChange: function onChange(event) {
        fieldProps.onChange(event.target.value);
        setCurrentValue(event.target.value);
      }
    })), jsx(FieldMessages, {
      error: error
    }));
  }), currentValue !== 'custom' ? jsx("div", {
    css: hidden
  }, jsx(Field, {
    name: "".concat(name, ".from"),
    defaultValue: currentValue
  }, function (_ref6) {
    var fieldProps = _ref6.fieldProps;
    return jsx(TextField, _extends({}, fieldProps, {
      type: "hidden"
    }));
  })) : jsx("div", {
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