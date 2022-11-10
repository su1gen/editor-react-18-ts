"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SelectField;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _form = require("@atlaskit/form");

var _select = _interopRequireDefault(require("@atlaskit/select"));

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _utils = require("../utils");

var _SelectItem = require("./SelectItem");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function SelectField(_ref) {
  var name = _ref.name,
      field = _ref.field,
      onFieldChange = _ref.onFieldChange,
      autoFocus = _ref.autoFocus,
      placeholder = _ref.placeholder,
      fieldDefaultValue = _ref.fieldDefaultValue;
  //ignore arrays as mutli-value select fields are always clearable
  var hasValidSingleDefaultValue = !Array.isArray(fieldDefaultValue) && fieldDefaultValue !== undefined;
  var isClearable = !hasValidSingleDefaultValue || field.isMultiple;
  return /*#__PURE__*/_react.default.createElement(_form.Field, {
    name: name,
    label: field.label,
    defaultValue: (0, _utils.getOptionFromValue)(field.items, field.defaultValue),
    isRequired: field.isRequired,
    validate: function validate(value) {
      return (0, _utils.validate)(field, value);
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_select.default, (0, _extends2.default)({}, fieldProps, {
      onChange: function onChange(value) {
        fieldProps.onChange(value);
        onFieldChange(name, true);
      } // @see DST-2386 & ED-12503
      ,
      enableAnimation: false // add type cast to avoid adding a "IsMulti" generic prop (TODO: ED-12072)
      ,
      isMulti: field.isMultiple || false,
      options: field.items || [],
      isClearable: isClearable,
      validationState: error ? 'error' : 'default',
      formatOptionLabel: _SelectItem.formatOptionLabel,
      autoFocus: autoFocus,
      menuPlacement: "auto",
      placeholder: placeholder
    })), /*#__PURE__*/_react.default.createElement(_FieldMessages.default, {
      error: error,
      description: field.description
    }));
  });
}