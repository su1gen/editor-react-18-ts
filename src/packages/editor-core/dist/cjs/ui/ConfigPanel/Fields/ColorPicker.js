"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("@emotion/react");

var _react2 = require("react");

var _form = require("@atlaskit/form");

var _common = require("../../../ui/ColorPalette/Palettes/common");

var _utils = require("../utils");

var _constants = require("@atlaskit/theme/constants");

var _RequiredIndicator = require("./common/RequiredIndicator");

var _typography = require("@atlaskit/theme/typography");

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _ColorPickerButton = _interopRequireDefault(require("../../ColorPickerButton"));

var _templateObject, _templateObject2;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/*
    NOTE: color used here are not yet in atlaskit code
    this is part of extended color pack from ADG, which is yet to be release
    at the time of writing this.

    Colour sequence source: https://product-fabric.atlassian.net/browse/ED-12650?focusedCommentId=204875
*/
var colorPalette = [{
  label: 'Light Blue',
  value: '#7AB2FFFF'
}, // 400
{
  label: 'Light Green',
  value: '#6BE1B0FF'
}, // 400
{
  label: 'Light Yellow',
  value: '#FFDB57FF'
}, // 400
{
  label: 'Light Red',
  value: '#FF8F73FF'
}, // 400
{
  label: 'Light Purple',
  value: '#B5A7FBFF'
}, // 400
{
  label: 'Blue',
  value: '#247FFFFF'
}, // 600
{
  label: 'Green',
  value: '#23A971FF'
}, // 600
{
  label: 'Yellow',
  value: '#FFBE33FF'
}, // 600
{
  label: 'Red',
  value: '#FC552CFF'
}, // 600
{
  label: 'Purple',
  value: '#8B77EEFF'
}, // 600
{
  label: 'Dark Blue',
  value: '#0055CCFF'
}, // 800
{
  label: 'Dark Green',
  value: '#177D52FF'
}, // 800
{
  label: 'Dark Yellow',
  value: '#FF9D00FF'
}, // 800
{
  label: 'Dark Red',
  value: '#D32D03FF'
}, // 800
{
  label: 'Dark Purple',
  value: '#5A43D0FF'
}, // 800
{
  label: 'Darker Blue',
  value: '#003884FF'
}, // 1000
{
  label: 'Darker Green',
  value: '#055C3FFF'
}, // 1000
{
  label: 'Darker Yellow',
  value: '#946104FF'
}, // 1000
{
  label: 'Darker Red',
  value: '#A32000FF'
}, // 1000
{
  label: 'Darker Purple',
  value: '#44368BFF'
} // 1000
].map(function (color) {
  return _objectSpread(_objectSpread({}, color), {}, {
    border: _common.DEFAULT_BORDER_COLOR
  });
});
var colorPickerWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: ", "px;\n  padding-right: ", "px;\n"])), 4 * (0, _constants.gridSize)(), (0, _constants.gridSize)());
var colorPickerLabel = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  font-size: ", "px;\n  margin-top: 0;\n"])), _typography.headingSizes.h400.size);

var ColorPicker = function ColorPicker(props) {
  var name = props.name,
      title = props.title,
      currentColor = props.currentColor,
      colorPalette = props.colorPalette,
      onChange = props.onChange,
      onFieldChange = props.onFieldChange;

  var onColorChange = function onColorChange(color) {
    var colorValue = color.value;

    if (!(0, _utils.isValidHex)(colorValue)) {
      throw new Error('invalid hex value');
    }

    onChange(colorValue);
    onFieldChange(name, currentColor !== colorValue);
  };

  return (0, _react.jsx)(_ColorPickerButton.default, {
    title: title,
    currentColor: currentColor,
    onChange: onColorChange,
    colorPalette: colorPalette,
    cols: 5,
    alignX: "right",
    placement: "ConfigPanel",
    size: {
      width: 3 * (0, _constants.gridSize)(),
      height: 3 * (0, _constants.gridSize)()
    }
  });
};

var ColorPickerField = function ColorPickerField(_ref) {
  var name = _ref.name,
      field = _ref.field,
      onFieldChange = _ref.onFieldChange;
  var label = field.label,
      defaultValue = field.defaultValue,
      isRequired = field.isRequired;
  return (0, _react.jsx)(_form.Field, {
    name: name,
    isRequired: isRequired,
    defaultValue: defaultValue,
    validate: function validate(value) {
      return (0, _utils.validate)(field, value || '');
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return (0, _react.jsx)(_react2.Fragment, null, (0, _react.jsx)("div", {
      css: colorPickerWrapper
    }, (0, _react.jsx)("label", {
      css: colorPickerLabel
    }, label, isRequired && (0, _react.jsx)("span", {
      css: _RequiredIndicator.requiredIndicator,
      "aria-hidden": "true"
    }, "*")), (0, _react.jsx)(ColorPicker, {
      name: name,
      title: label,
      currentColor: fieldProps.value,
      colorPalette: colorPalette,
      onChange: fieldProps.onChange,
      onFieldChange: onFieldChange
    })), error && (0, _react.jsx)(_FieldMessages.default, {
      error: error,
      description: ""
    }));
  });
};

var _default = ColorPickerField;
exports.default = _default;