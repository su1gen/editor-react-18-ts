"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Boolean;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _checkbox = require("@atlaskit/checkbox");

var _form = require("@atlaskit/form");

var _toggle = _interopRequireDefault(require("@atlaskit/toggle"));

var _types = require("../types");

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _RequiredIndicator = require("./common/RequiredIndicator");

var _excluded = ["value"],
    _excluded2 = ["id", "value"];

var _templateObject, _templateObject2;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var toggleFieldWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n"])));
var toggleLabel = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  padding: 3px 3px 3px 0px;\n  flex-grow: 1;\n"])));

function _validate(value, isRequired) {
  if (isRequired && !value) {
    return _types.ValidationError.Required;
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
  return (0, _react2.jsx)(_form.Field, {
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
        restFieldProps = (0, _objectWithoutProperties2.default)(fieldProps, _excluded);
    return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(_checkbox.Checkbox, (0, _extends2.default)({}, restFieldProps, {
      label: label,
      onChange: function onChange(event) {
        return handleOnChange(fieldProps.onChange, onFieldChange, event);
      },
      isChecked: isChecked
    })), (0, _react2.jsx)(_FieldMessages.default, {
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
  return (0, _react2.jsx)(_form.Field, {
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
        restFieldProps = (0, _objectWithoutProperties2.default)(fieldProps, _excluded2);
    return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)("div", {
      css: toggleFieldWrapper
    }, (0, _react2.jsx)("label", {
      css: toggleLabel,
      id: id,
      htmlFor: id
    }, label, isRequired ? (0, _react2.jsx)("span", {
      css: _RequiredIndicator.requiredIndicator,
      "aria-hidden": "true"
    }, "*") : null), (0, _react2.jsx)(_toggle.default, (0, _extends2.default)({}, restFieldProps, {
      onChange: function onChange(event) {
        return handleOnChange(fieldProps.onChange, onFieldChange, event);
      },
      isChecked: isChecked
    }))), (0, _react2.jsx)(_FieldMessages.default, {
      error: error,
      description: description
    }));
  });
}

function Boolean(_ref5) {
  var name = _ref5.name,
      field = _ref5.field,
      onFieldChange = _ref5.onFieldChange;

  if (field.style === 'toggle') {
    return (0, _react2.jsx)(Toggle, {
      name: name,
      field: field,
      onFieldChange: onFieldChange
    });
  }

  return (0, _react2.jsx)(Checkbox, {
    name: name,
    field: field,
    onFieldChange: onFieldChange
  });
}