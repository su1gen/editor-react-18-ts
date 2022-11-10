import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { ValidationError } from './types';
export var validate = function validate(field, value) {
  return validateRequired(field, value);
};
export var fromEntries = function fromEntries(iterable) {
  return _toConsumableArray(iterable).reduce(function (obj, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    obj[key] = val;
    return obj;
  }, {});
};

var isEmptyString = function isEmptyString(value) {
  return typeof value === 'string' && value === '';
};

var isEmptyArray = function isEmptyArray(value) {
  return Array.isArray(value) && value.length === 0;
};

export var validateRequired = function validateRequired(_ref3, value) {
  var isRequired = _ref3.isRequired,
      isMultiple = _ref3.isMultiple;

  if (isRequired) {
    var isUndefined = typeof value === 'undefined';
    var isEmpty = isEmptyString(value) || isMultiple && isEmptyArray(value) || false;
    return isUndefined || isEmpty ? ValidationError.Required : undefined;
  }

  return undefined;
};
export var getOptionFromValue = function getOptionFromValue(options, value) {
  if (!Array.isArray(options) || options.length === 0) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return options.filter(function (option) {
      return value.includes(option.value);
    });
  }

  return options.find(function (option) {
    return value === option.value;
  });
}; // Atlaskit uses final-form to power the form.
// Final-form will create nesting in the tree if a dot (.) is used in the name of the field.
// A parent is provided from a <Fieldset /> and is appended to the name here for simplicity

export var getSafeParentedName = function getSafeParentedName(name, parentName) {
  if (parentName && name.indexOf("".concat(parentName, ".")) === -1) {
    return "".concat(parentName, ".").concat(name);
  }

  return name;
};
var duplicateFieldRegex = /:[0-9]+$/;
export var isDuplicateField = function isDuplicateField(key) {
  return duplicateFieldRegex.test(key);
};
export var getNameFromDuplicateField = function getNameFromDuplicateField(key) {
  return key.replace(duplicateFieldRegex, '');
};
/*
    ColorPickerButton only accepts 8 digit hex alpha values, for example:
    #123fffaa (8 digits, hex alpha)
    */

export var isValidHex = function isValidHex(color) {
  var hexRegexPattern = new RegExp('^#([a-fA-F0-9]{8})$');
  return hexRegexPattern.test(color);
};