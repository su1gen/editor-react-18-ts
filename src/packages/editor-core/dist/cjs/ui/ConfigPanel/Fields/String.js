"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = String;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _form = require("@atlaskit/form");

var _textarea = _interopRequireDefault(require("@atlaskit/textarea"));

var _textfield = _interopRequireDefault(require("@atlaskit/textfield"));

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _utils = require("../utils");

var _excluded = ["onChange"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function String(_ref) {
  var name = _ref.name,
      field = _ref.field,
      autoFocus = _ref.autoFocus,
      onFieldChange = _ref.onFieldChange,
      placeholder = _ref.placeholder;
  var label = field.label,
      description = field.description,
      defaultValue = field.defaultValue,
      isRequired = field.isRequired;
  return /*#__PURE__*/_react.default.createElement(_form.Field, {
    name: name,
    label: label,
    defaultValue: defaultValue || '',
    isRequired: isRequired,
    validate: function validate(value) {
      return (0, _utils.validate)(field, value || '');
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error,
        meta = _ref2.meta;

    if (field.style === 'multiline') {
      var _onChange = fieldProps.onChange,
          restFieldProps = (0, _objectWithoutProperties2.default)(fieldProps, _excluded);
      var options = field.options;
      return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_textarea.default, (0, _extends2.default)({}, restFieldProps, options, {
        onChange: function onChange(e) {
          return _onChange(e.currentTarget.value);
        },
        onBlur: function onBlur() {
          fieldProps.onBlur();
          onFieldChange(name, meta.dirty);
        },
        placeholder: placeholder
      })), /*#__PURE__*/_react.default.createElement(_FieldMessages.default, {
        error: error,
        description: description
      }));
    }

    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_textfield.default, (0, _extends2.default)({}, fieldProps, {
      type: "text",
      autoFocus: autoFocus,
      onBlur: function onBlur() {
        fieldProps.onBlur();
        onFieldChange(name, meta.dirty);
      },
      placeholder: placeholder
    })), /*#__PURE__*/_react.default.createElement(_FieldMessages.default, {
      error: error,
      description: description
    }));
  });
}