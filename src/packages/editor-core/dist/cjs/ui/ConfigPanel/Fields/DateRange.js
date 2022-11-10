"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("react");

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _form = require("@atlaskit/form");

var _radio = require("@atlaskit/radio");

var _datetimePicker = require("@atlaskit/datetime-picker");

var _textfield = _interopRequireDefault(require("@atlaskit/textfield"));

var _messages = require("../messages");

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _utils = require("../utils");

var _templateObject, _templateObject2, _templateObject3;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var horizontalFields = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n"])));
var horizontalFieldWrapper = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  flex-basis: 47%;\n"])));
var hidden = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: none;\n"])));

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
  return (0, _react2.jsx)("div", {
    css: horizontalFieldWrapper,
    key: fieldName
  }, (0, _react2.jsx)(_form.Field, {
    name: "".concat(scope, ".").concat(fieldName),
    label: intl.formatMessage(_messages.messages[fieldName]),
    defaultValue: getFromDefaultValue(parentField, fieldName),
    isRequired: isRequired,
    validate: function validate(value) {
      return (0, _utils.validateRequired)({
        isRequired: isRequired
      }, value);
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(_datetimePicker.DatePicker, (0, _extends2.default)({}, fieldProps, {
      onChange: function onChange(date) {
        fieldProps.onChange(date);
        onFieldChange(parentField.name, true);
      },
      locale: intl.locale
    })), (0, _react2.jsx)(_FieldMessages.default, {
      error: error
    }));
  }));
};

var DateRange = function DateRange(_ref3) {
  var name = _ref3.name,
      field = _ref3.field,
      onFieldChange = _ref3.onFieldChange,
      intl = _ref3.intl;
  var items = (0, _react.useMemo)(function () {
    return [].concat((0, _toConsumableArray2.default)(field.items || []), [{
      label: intl.formatMessage(_messages.messages.custom),
      value: 'custom'
    }]).map(function (option) {
      return _objectSpread(_objectSpread({}, option), {}, {
        name: name
      });
    });
  }, [field.items, name, intl]);

  var _useState = (0, _react.useState)(getFromDefaultValue(field, 'value') || items[0].value),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      currentValue = _useState2[0],
      setCurrentValue = _useState2[1];

  (0, _react.useEffect)(function () {
    // calling onBlur here based on the currentValue changing will ensure that we
    // get the most up to date value after the form has been rendered
    onFieldChange(name, true);
  }, [currentValue, onFieldChange, name]);
  var element = (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)("div", {
    css: hidden
  }, (0, _react2.jsx)(_form.Field, {
    name: "".concat(name, ".type"),
    defaultValue: 'date-range'
  }, function (_ref4) {
    var fieldProps = _ref4.fieldProps;
    return (0, _react2.jsx)(_textfield.default, (0, _extends2.default)({}, fieldProps, {
      type: "hidden"
    }));
  })), (0, _react2.jsx)(_form.Field, {
    name: "".concat(name, ".value"),
    label: field.label,
    defaultValue: currentValue,
    isRequired: field.isRequired,
    validate: function validate(value) {
      return (0, _utils.validate)(field, value || '');
    }
  }, function (_ref5) {
    var fieldProps = _ref5.fieldProps,
        error = _ref5.error;
    return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(_radio.RadioGroup, (0, _extends2.default)({}, fieldProps, {
      options: items,
      onChange: function onChange(event) {
        fieldProps.onChange(event.target.value);
        setCurrentValue(event.target.value);
      }
    })), (0, _react2.jsx)(_FieldMessages.default, {
      error: error
    }));
  }), currentValue !== 'custom' ? (0, _react2.jsx)("div", {
    css: hidden
  }, (0, _react2.jsx)(_form.Field, {
    name: "".concat(name, ".from"),
    defaultValue: currentValue
  }, function (_ref6) {
    var fieldProps = _ref6.fieldProps;
    return (0, _react2.jsx)(_textfield.default, (0, _extends2.default)({}, fieldProps, {
      type: "hidden"
    }));
  })) : (0, _react2.jsx)("div", {
    css: horizontalFields
  }, (0, _react2.jsx)(DateField, {
    scope: name,
    parentField: field,
    fieldName: "from",
    onFieldChange: onFieldChange,
    intl: intl,
    isRequired: field.isRequired
  }), (0, _react2.jsx)(DateField, {
    scope: name,
    parentField: field,
    fieldName: "to",
    onFieldChange: onFieldChange,
    intl: intl,
    isRequired: field.isRequired
  })), (0, _react2.jsx)(_FieldMessages.default, {
    description: field.description
  }));
  return element;
};

var _default = (0, _reactIntlNext.injectIntl)(DateRange);

exports.default = _default;