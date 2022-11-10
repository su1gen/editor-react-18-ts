"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRequired = exports.validate = exports.isValidHex = exports.isDuplicateField = exports.getSafeParentedName = exports.getOptionFromValue = exports.getNameFromDuplicateField = exports.fromEntries = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _types = require("./types");

var validate = function validate(field, value) {
  return validateRequired(field, value);
};

exports.validate = validate;

var fromEntries = function fromEntries(iterable) {
  return (0, _toConsumableArray2.default)(iterable).reduce(function (obj, _ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    obj[key] = val;
    return obj;
  }, {});
};

exports.fromEntries = fromEntries;

var isEmptyString = function isEmptyString(value) {
  return typeof value === 'string' && value === '';
};

var isEmptyArray = function isEmptyArray(value) {
  return Array.isArray(value) && value.length === 0;
};

var validateRequired = function validateRequired(_ref3, value) {
  var isRequired = _ref3.isRequired,
      isMultiple = _ref3.isMultiple;

  if (isRequired) {
    var isUndefined = typeof value === 'undefined';
    var isEmpty = isEmptyString(value) || isMultiple && isEmptyArray(value) || false;
    return isUndefined || isEmpty ? _types.ValidationError.Required : undefined;
  }

  return undefined;
};

exports.validateRequired = validateRequired;

var getOptionFromValue = function getOptionFromValue(options, value) {
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


exports.getOptionFromValue = getOptionFromValue;

var getSafeParentedName = function getSafeParentedName(name, parentName) {
  if (parentName && name.indexOf("".concat(parentName, ".")) === -1) {
    return "".concat(parentName, ".").concat(name);
  }

  return name;
};

exports.getSafeParentedName = getSafeParentedName;
var duplicateFieldRegex = /:[0-9]+$/;

var isDuplicateField = function isDuplicateField(key) {
  return duplicateFieldRegex.test(key);
};

exports.isDuplicateField = isDuplicateField;

var getNameFromDuplicateField = function getNameFromDuplicateField(key) {
  return key.replace(duplicateFieldRegex, '');
};
/*
    ColorPickerButton only accepts 8 digit hex alpha values, for example:
    #123fffaa (8 digits, hex alpha)
    */


exports.getNameFromDuplicateField = getNameFromDuplicateField;

var isValidHex = function isValidHex(color) {
  var hexRegexPattern = new RegExp('^#([a-fA-F0-9]{8})$');
  return hexRegexPattern.test(color);
};

exports.isValidHex = isValidHex;