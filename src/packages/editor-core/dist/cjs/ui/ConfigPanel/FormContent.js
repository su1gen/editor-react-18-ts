"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldComponent = FieldComponent;
exports.default = FormContent;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _extensions = require("@atlaskit/editor-common/extensions");

var _ColorPicker = _interopRequireDefault(require("./Fields/ColorPicker"));

var _Boolean = _interopRequireDefault(require("./Fields/Boolean"));

var _CustomSelect = _interopRequireDefault(require("./Fields/CustomSelect"));

var _Date = _interopRequireDefault(require("./Fields/Date"));

var _DateRange = _interopRequireDefault(require("./Fields/DateRange"));

var _Enum = _interopRequireDefault(require("./Fields/Enum"));

var _Fieldset = _interopRequireDefault(require("./Fields/Fieldset"));

var _Number = _interopRequireDefault(require("./Fields/Number"));

var _String = _interopRequireDefault(require("./Fields/String"));

var _UnhandledType = _interopRequireDefault(require("./Fields/UnhandledType"));

var _UserSelect = _interopRequireDefault(require("./Fields/UserSelect"));

var _Expand = _interopRequireDefault(require("./Fields/Expand"));

var _TabGroup = _interopRequireDefault(require("./Fields/TabGroup"));

var _RemovableField = _interopRequireDefault(require("./NestedForms/RemovableField"));

var _utils = require("./utils");

var _FormErrorBoundary = require("./FormErrorBoundary");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function FieldComponent(_ref) {
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
  var parentedName = (0, _utils.getSafeParentedName)(name, parentName);
  var fieldDefaultValue = field.type === 'enum' ? field.defaultValue : undefined;

  if (name in parameters && !(0, _extensions.isFieldset)(field)) {
    field = _objectSpread(_objectSpread({}, field), {}, {
      defaultValue: defaultValue
    });
  }

  switch (field.type) {
    case 'string':
      return /*#__PURE__*/_react.default.createElement(_String.default, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        placeholder: field.placeholder
      });

    case 'number':
      return /*#__PURE__*/_react.default.createElement(_Number.default, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        placeholder: field.placeholder
      });

    case 'boolean':
      return /*#__PURE__*/_react.default.createElement(_Boolean.default, {
        name: parentedName,
        field: field,
        onFieldChange: onFieldChange
      });

    case 'color':
      return /*#__PURE__*/_react.default.createElement(_ColorPicker.default, {
        name: parentedName,
        field: field,
        onFieldChange: onFieldChange
      });

    case 'date':
      return /*#__PURE__*/_react.default.createElement(_Date.default, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        placeholder: field.placeholder
      });

    case 'date-range':
      return /*#__PURE__*/_react.default.createElement(_DateRange.default, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange
      });

    case 'enum':
      return /*#__PURE__*/_react.default.createElement(_Enum.default, {
        name: parentedName,
        field: field,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        fieldDefaultValue: fieldDefaultValue
      });

    case 'custom':
      return /*#__PURE__*/_react.default.createElement(_CustomSelect.default, {
        name: parentedName,
        field: field,
        extensionManifest: extensionManifest,
        placeholder: field.placeholder,
        autoFocus: autoFocus,
        onFieldChange: onFieldChange,
        parameters: parameters
      });

    case 'fieldset':
      return /*#__PURE__*/_react.default.createElement(_Fieldset.default, {
        name: parentedName,
        field: field,
        firstVisibleFieldName: firstVisibleFieldName,
        onFieldChange: onFieldChange,
        extensionManifest: extensionManifest,
        parameters: defaultValue || {},
        error: error
      });

    case 'user':
      return /*#__PURE__*/_react.default.createElement(_UserSelect.default, {
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
        return /*#__PURE__*/_react.default.createElement(_Expand.default, {
          field: field,
          isExpanded: field.isExpanded
        }, /*#__PURE__*/_react.default.createElement(FormContent, {
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
          return /*#__PURE__*/_react.default.createElement(FormContent, {
            parentName: parentName,
            fields: tabField.fields,
            parameters: tabParameters,
            onFieldChange: onFieldChange,
            extensionManifest: extensionManifest
          });
        };

        return /*#__PURE__*/_react.default.createElement(_TabGroup.default, {
          field: tabGroupField,
          renderPanel: renderPanel
        });
      }

    default:
      return /*#__PURE__*/_react.default.createElement(_UnhandledType.default, {
        field: field,
        errorMessage: "Field \"".concat(name, "\" of type \"").concat(type, "\" not supported")
      });
  }
}

function Hidden(_ref2) {
  var children = _ref2.children;
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'none'
    }
  }, children);
}

function FormContent(_ref3) {
  var fields = _ref3.fields,
      parentName = _ref3.parentName,
      parameters = _ref3.parameters,
      extensionManifest = _ref3.extensionManifest,
      canRemoveFields = _ref3.canRemoveFields,
      onClickRemove = _ref3.onClickRemove,
      onFieldChange = _ref3.onFieldChange,
      firstVisibleFieldName = _ref3.firstVisibleFieldName,
      contextIdentifierProvider = _ref3.contextIdentifierProvider;
  return /*#__PURE__*/_react.default.createElement(_FormErrorBoundary.FormErrorBoundary, {
    contextIdentifierProvider: contextIdentifierProvider,
    extensionKey: extensionManifest.key,
    fields: fields
  }, fields.map(function (field) {
    var fieldElement = /*#__PURE__*/_react.default.createElement(FieldComponent, {
      field: field,
      parameters: parameters || {},
      parentName: parentName,
      extensionManifest: extensionManifest,
      firstVisibleFieldName: firstVisibleFieldName,
      onFieldChange: onFieldChange
    }); // only to be supported by String fields at this time


    if ('isHidden' in field && field.isHidden) {
      fieldElement = /*#__PURE__*/_react.default.createElement(Hidden, null, fieldElement);
    }

    var name = field.name,
        type = field.type;
    return /*#__PURE__*/_react.default.createElement(_RemovableField.default, {
      key: name,
      name: name,
      canRemoveField: canRemoveFields && !field.isRequired,
      onClickRemove: onClickRemove,
      className: "field-wrapper-".concat(type)
    }, fieldElement);
  }));
}