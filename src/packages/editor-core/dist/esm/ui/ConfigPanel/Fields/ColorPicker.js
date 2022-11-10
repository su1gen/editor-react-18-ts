import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

var _templateObject, _templateObject2;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import { DEFAULT_BORDER_COLOR } from '../../../ui/ColorPalette/Palettes/common';
import { isValidHex } from '../utils';
import { validate as _validate } from '../utils';
import { gridSize } from '@atlaskit/theme/constants';
import { requiredIndicator } from './common/RequiredIndicator';
import { headingSizes } from '@atlaskit/theme/typography';
import FieldMessages from '../FieldMessages';
import ColorPickerButton from '../../ColorPickerButton';
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
    border: DEFAULT_BORDER_COLOR
  });
});
var colorPickerWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: ", "px;\n  padding-right: ", "px;\n"])), 4 * gridSize(), gridSize());
var colorPickerLabel = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  font-size: ", "px;\n  margin-top: 0;\n"])), headingSizes.h400.size);

var ColorPicker = function ColorPicker(props) {
  var name = props.name,
      title = props.title,
      currentColor = props.currentColor,
      colorPalette = props.colorPalette,
      onChange = props.onChange,
      onFieldChange = props.onFieldChange;

  var onColorChange = function onColorChange(color) {
    var colorValue = color.value;

    if (!isValidHex(colorValue)) {
      throw new Error('invalid hex value');
    }

    onChange(colorValue);
    onFieldChange(name, currentColor !== colorValue);
  };

  return jsx(ColorPickerButton, {
    title: title,
    currentColor: currentColor,
    onChange: onColorChange,
    colorPalette: colorPalette,
    cols: 5,
    alignX: "right",
    placement: "ConfigPanel",
    size: {
      width: 3 * gridSize(),
      height: 3 * gridSize()
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
  return jsx(Field, {
    name: name,
    isRequired: isRequired,
    defaultValue: defaultValue,
    validate: function validate(value) {
      return _validate(field, value || '');
    }
  }, function (_ref2) {
    var fieldProps = _ref2.fieldProps,
        error = _ref2.error;
    return jsx(Fragment, null, jsx("div", {
      css: colorPickerWrapper
    }, jsx("label", {
      css: colorPickerLabel
    }, label, isRequired && jsx("span", {
      css: requiredIndicator,
      "aria-hidden": "true"
    }, "*")), jsx(ColorPicker, {
      name: name,
      title: label,
      currentColor: fieldProps.value,
      colorPalette: colorPalette,
      onChange: fieldProps.onChange,
      onFieldChange: onFieldChange
    })), error && jsx(FieldMessages, {
      error: error,
      description: ""
    }));
  });
};

export default ColorPickerField;