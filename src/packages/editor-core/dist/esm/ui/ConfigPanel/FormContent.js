import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { isFieldset } from '@atlaskit/editor-common/extensions';
import ColorPicker from './Fields/ColorPicker';
import Boolean from './Fields/Boolean';
import CustomSelect from './Fields/CustomSelect';
import Date from './Fields/Date';
import DateRange from './Fields/DateRange';
import Enum from './Fields/Enum'; // eslint-disable-next-line import/no-cycle

import Fieldset from './Fields/Fieldset';
import Number from './Fields/Number';
import String from './Fields/String';
import UnhandledType from './Fields/UnhandledType';
import UserSelect from './Fields/UserSelect';
import Expand from './Fields/Expand';
import TabGroup from './Fields/TabGroup';
import RemovableField from './NestedForms/RemovableField';
import { getSafeParentedName } from './utils';
import { FormErrorBoundary } from './FormErrorBoundary';
export function FieldComponent(_ref) {
  var _parameters$errors;

  var field = _ref.field,
      parameters = _ref.parameters,
      parentName = _ref.parentName,
      extensionManifest = _ref.extensionManifest,
      firstVisibleFieldName = _ref.firstVisibleFieldName,
      onFieldChange = _ref.onFieldChange;
  var _field = field,
      name = _field.name,
      type = _field.type;
  var autoFocus = name === firstVisibleFieldName;
  var defaultValue = parameters[name];
  var error = (_parameters$errors = parameters.errors) === null || _parameters$errors === void 0 ? void 0 : _parameters$errors[name];
  var parentedName = getSafeParentedName(name, parentName);
  var fieldDefaultValue = field.type === 'enum' ? field.defaultValue : undefined;

  if (name in parameters && !isFieldset(field)) {
    field = _objectSpread(_objectSpread({}, field), {}, {
      defaultValue: defaultValue
    });
  }

  switch (field.type) {
    case 'string':
      return /*#__PURE__*/React.createElement(String, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        placeholder: field.placeholder
      });

    case 'number':
      return /*#__PURE__*/React.createElement(Number, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        placeholder: field.placeholder
      });

    case 'boolean':
      return /*#__PURE__*/React.createElement(Boolean, {
        name: parentedName,
        field: field,
        onFieldChange: onFieldChange
      });

    case 'color':
      return /*#__PURE__*/React.createElement(ColorPicker, {
        name: parentedName,
        field: field,
        onFieldChange: onFieldChange
      });

    case 'date':
      return /*#__PURE__*/React.createElement(Date, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        placeholder: field.placeholder
      });

    case 'date-range':
      return /*#__PURE__*/React.createElement(DateRange, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange
      });

    case 'enum':
      return /*#__PURE__*/React.createElement(Enum, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        fieldDefaultValue: fieldDefaultValue
      });

    case 'custom':
      return /*#__PURE__*/React.createElement(CustomSelect, {
        name: parentedName,
        field: field,
        extensionManifest: extensionManifest,
        placeholder: field.placeholder,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        parameters: parameters
      });

    case 'fieldset':
      return /*#__PURE__*/React.createElement(Fieldset, {
        name: parentedName,
        field: field,
        firstVisibleFieldName: firstVisibleFieldName,
        onFieldChange: onFieldChange,
        extensionManifest: extensionManifest,
        parameters: defaultValue || {},
        error: error
      });

    case 'user':
      return /*#__PURE__*/React.createElement(UserSelect, {
        name: parentedName,
        field: field,
        autoFocus: name === firstVisibleFieldName,
        extensionManifest: extensionManifest,
        onFieldChange: onFieldChange
      });

    case 'expand':
      {
        // if expand is under a tab with hasGroupedValues=true
        var resolvedParentName = [parentName, field.hasGroupedValues ? field.name : undefined].filter(function (val) {
          return !!val;
        }).join('.') || undefined;
        var resolvedParameters = !field.hasGroupedValues ? parameters : parameters[field.name] || {};
        return /*#__PURE__*/React.createElement(Expand, {
          field: field,
          isExpanded: field.isExpanded
        }, /*#__PURE__*/React.createElement(FormContent, {
          parentName: resolvedParentName,
          fields: field.fields,
          parameters: resolvedParameters,
          onFieldChange: onFieldChange,
          extensionManifest: extensionManifest
        }));
      }

    case 'tab-group':
      {
        var tabGroupField = field;
        var tabGroupParams = tabGroupField.hasGroupedValues ? parameters[tabGroupField.name] || {} : parameters;

        var renderPanel = function renderPanel(tabField) {
          var parentName = [tabGroupField.hasGroupedValues ? tabGroupField.name : undefined, tabField.hasGroupedValues ? tabField.name : undefined].filter(function (val) {
            return !!val;
          }).join('.') || undefined;
          var tabParameters = tabField.hasGroupedValues ? tabGroupParams[tabField.name] || {} : tabGroupParams;
          return /*#__PURE__*/React.createElement(FormContent, {
            parentName: parentName,
            fields: tabField.fields,
            parameters: tabParameters,
            onFieldChange: onFieldChange,
            extensionManifest: extensionManifest
          });
        };

        return /*#__PURE__*/React.createElement(TabGroup, {
          field: tabGroupField,
          renderPanel: renderPanel
        });
      }

    default:
      return /*#__PURE__*/React.createElement(UnhandledType, {
        field: field,
        errorMessage: "Field \"".concat(name, "\" of type \"").concat(type, "\" not supported")
      });
  }
}

function Hidden(_ref2) {
  var children = _ref2.children;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'none'
    }
  }, children);
}

export default function FormContent(_ref3) {
  var fields = _ref3.fields,
      parentName = _ref3.parentName,
      parameters = _ref3.parameters,
      extensionManifest = _ref3.extensionManifest,
      canRemoveFields = _ref3.canRemoveFields,
      onClickRemove = _ref3.onClickRemove,
      onFieldChange = _ref3.onFieldChange,
      firstVisibleFieldName = _ref3.firstVisibleFieldName,
      contextIdentifierProvider = _ref3.contextIdentifierProvider;
  return /*#__PURE__*/React.createElement(FormErrorBoundary, {
    contextIdentifierProvider: contextIdentifierProvider,
    extensionKey: extensionManifest.key,
    fields: fields
  }, fields.map(function (field) {
    var fieldElement = /*#__PURE__*/React.createElement(FieldComponent, {
      field: field,
      parameters: parameters || {},
      parentName: parentName,
      extensionManifest: extensionManifest,
      firstVisibleFieldName: firstVisibleFieldName,
      onFieldChange: onFieldChange
    }); // only to be supported by String fields at this time

    if ('isHidden' in field && field.isHidden) {
      fieldElement = /*#__PURE__*/React.createElement(Hidden, null, fieldElement);
    }

    var name = field.name,
        type = field.type;
    return /*#__PURE__*/React.createElement(RemovableField, {
      key: name,
      name: name,
      canRemoveField: canRemoveFields && !field.isRequired,
      onClickRemove: onClickRemove,
      className: "field-wrapper-".concat(type)
    }, fieldElement);
  }));
}