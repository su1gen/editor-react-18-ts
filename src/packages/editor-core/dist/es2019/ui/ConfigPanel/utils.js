import { ValidationError } from './types';
export const validate = (field, value) => {
  return validateRequired(field, value);
};
export const fromEntries = iterable => {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {});
};

const isEmptyString = value => typeof value === 'string' && value === '';

const isEmptyArray = value => Array.isArray(value) && value.length === 0;

export const validateRequired = ({
  isRequired,
  isMultiple
}, value) => {
  if (isRequired) {
    const isUndefined = typeof value === 'undefined';
    const isEmpty = isEmptyString(value) || isMultiple && isEmptyArray(value) || false;
    return isUndefined || isEmpty ? ValidationError.Required : undefined;
  }

  return undefined;
};
export const getOptionFromValue = (options, value) => {
  if (!Array.isArray(options) || options.length === 0) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return options.filter(option => value.includes(option.value));
  }

  return options.find(option => value === option.value);
}; // Atlaskit uses final-form to power the form.
// Final-form will create nesting in the tree if a dot (.) is used in the name of the field.
// A parent is provided from a <Fieldset /> and is appended to the name here for simplicity

export const getSafeParentedName = (name, parentName) => {
  if (parentName && name.indexOf(`${parentName}.`) === -1) {
    return `${parentName}.${name}`;
  }

  return name;
};
const duplicateFieldRegex = /:[0-9]+$/;
export const isDuplicateField = key => duplicateFieldRegex.test(key);
export const getNameFromDuplicateField = key => key.replace(duplicateFieldRegex, '');
/*
    ColorPickerButton only accepts 8 digit hex alpha values, for example:
    #123fffaa (8 digits, hex alpha)
    */

export const isValidHex = color => {
  const hexRegexPattern = new RegExp('^#([a-fA-F0-9]{8})$');
  return hexRegexPattern.test(color);
};