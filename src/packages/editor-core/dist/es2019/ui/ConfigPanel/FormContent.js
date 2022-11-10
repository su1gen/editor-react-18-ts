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
export function FieldComponent({
  field,
  parameters,
  parentName,
  extensionManifest,
  firstVisibleFieldName,
  onFieldChange
}) {
  var _parameters$errors;

  const {
    name,
    type
  } = field;
  const autoFocus = name === firstVisibleFieldName;
  const defaultValue = parameters[name];
  const error = (_parameters$errors = parameters.errors) === null || _parameters$errors === void 0 ? void 0 : _parameters$errors[name];
  const parentedName = getSafeParentedName(name, parentName);
  const fieldDefaultValue = field.type === 'enum' ? field.defaultValue : undefined;

  if (name in parameters && !isFieldset(field)) {
    field = { ...field,
      defaultValue
    };
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
        const resolvedParentName = [parentName, field.hasGroupedValues ? field.name : undefined].filter(val => !!val).join('.') || undefined;
        const resolvedParameters = !field.hasGroupedValues ? parameters : parameters[field.name] || {};
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
        const tabGroupField = field;
        const tabGroupParams = tabGroupField.hasGroupedValues ? parameters[tabGroupField.name] || {} : parameters;

        const renderPanel = tabField => {
          const parentName = [tabGroupField.hasGroupedValues ? tabGroupField.name : undefined, tabField.hasGroupedValues ? tabField.name : undefined].filter(val => !!val).join('.') || undefined;
          const tabParameters = tabField.hasGroupedValues ? tabGroupParams[tabField.name] || {} : tabGroupParams;
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
        errorMessage: `Field "${name}" of type "${type}" not supported`
      });
  }
}

function Hidden({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'none'
    }
  }, children);
}

export default function FormContent({
  fields,
  parentName,
  parameters,
  extensionManifest,
  canRemoveFields,
  onClickRemove,
  onFieldChange,
  firstVisibleFieldName,
  contextIdentifierProvider
}) {
  return /*#__PURE__*/React.createElement(FormErrorBoundary, {
    contextIdentifierProvider: contextIdentifierProvider,
    extensionKey: extensionManifest.key,
    fields: fields
  }, fields.map(field => {
    let fieldElement = /*#__PURE__*/React.createElement(FieldComponent, {
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

    const {
      name,
      type
    } = field;
    return /*#__PURE__*/React.createElement(RemovableField, {
      key: name,
      name: name,
      canRemoveField: canRemoveFields && !field.isRequired,
      onClickRemove: onClickRemove,
      className: `field-wrapper-${type}`
    }, fieldElement);
  }));
}