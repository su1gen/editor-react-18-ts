"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RadioField;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _form = require("@atlaskit/form");

var _radio = require("@atlaskit/radio");

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _types = require("../types");

var _utils = require("../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function RadioField(_ref) {
  var name = _ref.name,
      field = _ref.field,
      onFieldChange = _ref.onFieldChange;

  if (field.isMultiple) {
    return /*#__PURE__*/_react.default.createElement(_FieldMessages.default, {
      error: _types.FieldTypeError.isMultipleAndRadio
    });
  }

  return /*#__PURE__*/_react.default.createElement(_form.Field, {
    name: name,
    label: field.label,
    defaultValue: field.defaultValue,
    isRequired: field.isRequired,
    validate: function validate(value) {
      return (0, _utils.validate)(field, value);
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_radio.RadioGroup, (0, _extends2.default)({}, fieldProps, {
      options: (field.items || []).map(function (option) {
        return _objectSpread(_objectSpread({}, option), {}, {
          name: field.name
        });
      }),
      onChange: function onChange(value) {
        fieldProps.onChange(value);
        onFieldChange(field.name, true);
      }
    })), /*#__PURE__*/_react.default.createElement(_FieldMessages.default, {
      error: error
    }));
  });
}