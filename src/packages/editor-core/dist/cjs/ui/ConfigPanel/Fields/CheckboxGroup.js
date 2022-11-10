"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CheckboxGroup;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("react");

var _react2 = require("@emotion/react");

var _checkbox = require("@atlaskit/checkbox");

var _form = require("@atlaskit/form");

var _tokens = require("@atlaskit/tokens");

var _types = require("../types");

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _excluded = ["onChange", "value"];

var _templateObject;

function _validate(value, isRequired) {
  if (isRequired && !(value !== null && value !== void 0 && value.length)) {
    return _types.ValidationError.Required;
  }
}

var requiredIndicator = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n"])), (0, _tokens.token)('color.text.danger', '#bf2600'));

function CheckboxGroupInner(_ref) {
  var label = _ref.label,
      description = _ref.description,
      onFieldChange = _ref.onFieldChange,
      options = _ref.options,
      error = _ref.error,
      fieldProps = _ref.fieldProps;
  var onChange = fieldProps.onChange,
      value = fieldProps.value,
      restFieldProps = (0, _objectWithoutProperties2.default)(fieldProps, _excluded);

  function _onChange(optionValue, isChecked) {
    var active = new Set(value ? value : []);

    if (isChecked) {
      active.add(optionValue);
    } else {
      active.delete(optionValue);
    }

    onChange((0, _toConsumableArray2.default)(active));
    onFieldChange();
  }

  return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(_form.Fieldset, {
    legend: label
  }, options.map(function (_ref2, i) {
    var optionLabel = _ref2.label,
        optionValue = _ref2.value;
    var isChecked = value && value.includes(optionValue);

    var onOptionChange = function onOptionChange(event) {
      _onChange(optionValue, event.target.checked);
    };

    return (0, _react2.jsx)(_checkbox.Checkbox, (0, _extends2.default)({
      key: i
    }, restFieldProps, {
      isRequired: false,
      label: optionLabel,
      isChecked: isChecked,
      onChange: onOptionChange
    }));
  })), (0, _react2.jsx)(_FieldMessages.default, {
    error: error,
    description: description
  }));
}

function CheckboxGroup(_ref3) {
  var name = _ref3.name,
      field = _ref3.field,
      onFieldChange = _ref3.onFieldChange;
  var labelBase = field.label,
      description = field.description,
      defaultValue = field.defaultValue,
      _field$isRequired = field.isRequired,
      isRequired = _field$isRequired === void 0 ? false : _field$isRequired,
      options = field.items;
  var label = (0, _react2.jsx)(_react.Fragment, null, labelBase, isRequired ? (0, _react2.jsx)("span", {
    css: requiredIndicator,
    "aria-hidden": "true"
  }, ' ', "*") : null);

  var _onFieldChange = (0, _react.useCallback)(function () {
    onFieldChange(name, true);
  }, [name, onFieldChange]);

  return (0, _react2.jsx)(_form.Field, {
    name: name,
    isRequired: isRequired,
    defaultValue: defaultValue,
    validate: function validate(value) {
      return _validate(value, isRequired);
    }
  }, function (props) {
    return (0, _react2.jsx)(CheckboxGroupInner, (0, _extends2.default)({
      label: label,
      description: description,
      options: options,
      onFieldChange: _onFieldChange
    }, props));
  });
}