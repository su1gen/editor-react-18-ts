import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import SectionMessage from '@atlaskit/section-message';
import Button from '@atlaskit/button/custom-theme-button';
import Select from '@atlaskit/select';
import AddCircleIcon from '@atlaskit/icon/glyph/add-circle';
import { messages } from '../messages'; // eslint-disable-next-line import/no-cycle

import FormContent from '../FormContent';
import { getNameFromDuplicateField, isDuplicateField } from '../utils';
import { gridSize } from '@atlaskit/theme/constants';
import { N40A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
var actionsWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  border-top: 1px solid ", ";\n  margin-top: ", "px;\n  padding-top: ", "px;\n"])), token('color.border', N40A), gridSize() * 2, gridSize() * 2);

var populateFromParameters = function populateFromParameters(parameters, fields) {
  if (Object.keys(parameters).length) {
    var keys = Object.keys(parameters);
    var existingFieldKeys = keys.filter(function (key) {
      return fields.find(function (field) {
        return field.name === getNameFromDuplicateField(key);
      });
    });

    if (existingFieldKeys.length > 0) {
      return existingFieldKeys;
    }
  }
};

var populateFromRequired = function populateFromRequired(fields) {
  return fields.filter(function (field) {
    return field.isRequired;
  }).map(function (field) {
    return field.name;
  });
};

var getInitialFields = function getInitialFields() {
  var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fields = arguments.length > 1 ? arguments[1] : undefined;
  var isDynamic = arguments.length > 2 ? arguments[2] : undefined;

  if (!isDynamic) {
    return new Set(fields.map(function (field) {
      return field.name;
    }));
  }

  var dynamicFields = [];
  var fromRequired = populateFromRequired(fields);

  if (fromRequired) {
    dynamicFields.push.apply(dynamicFields, _toConsumableArray(fromRequired));
  }

  var fromParameters = populateFromParameters(parameters, fields);

  if (fromParameters) {
    dynamicFields.push.apply(dynamicFields, _toConsumableArray(fromParameters));
  }

  if (dynamicFields.length === 0 && Array.isArray(fields) && fields.length > 0) {
    dynamicFields.push(fields[0].name);
  }

  return new Set(dynamicFields);
};

var FieldsetField = /*#__PURE__*/function (_React$Component) {
  _inherits(FieldsetField, _React$Component);

  var _super = _createSuper(FieldsetField);

  function FieldsetField(props) {
    var _this;

    _classCallCheck(this, FieldsetField);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "getSelectedFields", function (visibleFields) {
      var field = _this.props.field;
      return _toConsumableArray(visibleFields).map(function (fieldName) {
        var originalFieldDef = field.fields.find(function (field) {
          return field.name === getNameFromDuplicateField(fieldName);
        });

        var fieldDef = _objectSpread(_objectSpread({}, originalFieldDef), {}, {
          name: fieldName
        }); // for duplicate fields we only want the first one to actually be required


        if (originalFieldDef.name !== fieldName && fieldDef.isRequired === true) {
          fieldDef.isRequired = false;
        }

        return fieldDef;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getSelectOptions", function (visibleFields) {
      var field = _this.props.field;
      return field.fields.filter(function (field) {
        return field.allowDuplicates || !visibleFields.has(field.name);
      }).map(function (field) {
        return {
          value: field.name,
          label: field.label
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setIsAdding", function (value) {
      _this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          isAdding: value
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setCurrentParameters", function (parameters) {
      _this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          currentParameters: parameters
        });
      }, // callback required so autosave can be triggered on
      // the right moment if fields are being removed
      function () {
        return _this.props.onFieldChange(_this.props.field.name, true);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setVisibleFields", function (fields) {
      _this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          visibleFields: fields,
          selectedFields: _this.getSelectedFields(fields),
          selectOptions: _this.getSelectOptions(fields)
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSelectItem", function (option) {
      var visibleFields = _this.state.visibleFields;
      var newItem = option.value;

      var duplicates = _toConsumableArray(visibleFields).filter(function (field) {
        return getNameFromDuplicateField(field) === newItem;
      });

      if (duplicates.length > 0) {
        newItem += ":".concat(duplicates.length);
      }

      _this.setVisibleFields(new Set([].concat(_toConsumableArray(visibleFields), [newItem])));

      _this.setIsAdding(false);
    });

    _defineProperty(_assertThisInitialized(_this), "onClickRemove", function (fieldName) {
      var _this$state = _this.state,
          visibleFields = _this$state.visibleFields,
          currentParameters = _this$state.currentParameters;
      visibleFields.delete(fieldName);

      _this.setVisibleFields(new Set(visibleFields));

      var newParameters = _objectSpread({}, currentParameters);

      delete newParameters[fieldName]; // if any there are duplicate fields that come after the one removed, we want to reduce their
      // duplicate index eg. label:2 -> label:1

      if (isDuplicateField(fieldName)) {
        var _fieldName$split = fieldName.split(':'),
            _fieldName$split2 = _slicedToArray(_fieldName$split, 2),
            key = _fieldName$split2[0],
            idx = _fieldName$split2[1];

        var currentIdx = +idx;

        while (currentParameters["".concat(key, ":").concat(currentIdx + 1)]) {
          newParameters["".concat(key, ":").concat(currentIdx)] = currentParameters["".concat(key, ":").concat(currentIdx + 1)];
          currentIdx++;
        }

        delete newParameters["".concat(key, ":").concat(currentIdx)];
      }

      _this.setCurrentParameters(newParameters);
    });

    _defineProperty(_assertThisInitialized(_this), "renderActions", function () {
      var intl = _this.props.intl;
      var _this$state2 = _this.state,
          selectOptions = _this$state2.selectOptions,
          isAdding = _this$state2.isAdding;

      if (selectOptions.length === 0) {
        return null;
      }

      return jsx(React.Fragment, null, isAdding ? jsx(Select, {
        testId: "field-picker",
        defaultMenuIsOpen: true,
        autoFocus: true,
        placeholder: intl.formatMessage(messages.addField),
        options: selectOptions,
        onChange: function onChange(option) {
          if (option) {
            _this.onSelectItem(option);
          }
        }
      }) : jsx(Button, {
        testId: "add-more",
        appearance: "subtle",
        iconBefore: jsx(AddCircleIcon, {
          size: "small",
          label: intl.formatMessage(messages.addField)
        }),
        onClick: function onClick() {
          return _this.setIsAdding(true);
        }
      }, intl.formatMessage(messages.addField)));
    });

    var initialFields = getInitialFields(props.parameters, props.field.fields, props.field.options.isDynamic);
    _this.state = {
      isAdding: false,
      currentParameters: props.parameters || {},
      visibleFields: initialFields,
      selectedFields: _this.getSelectedFields(initialFields),
      selectOptions: _this.getSelectOptions(initialFields)
    };
    return _this;
  }

  _createClass(FieldsetField, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          name = _this$props.name,
          field = _this$props.field,
          extensionManifest = _this$props.extensionManifest,
          onFieldChange = _this$props.onFieldChange,
          firstVisibleFieldName = _this$props.firstVisibleFieldName,
          error = _this$props.error;
      var label = field.label,
          options = field.options;
      var _this$state3 = this.state,
          selectedFields = _this$state3.selectedFields,
          currentParameters = _this$state3.currentParameters,
          visibleFields = _this$state3.visibleFields;
      var children = this.renderActions();
      return jsx(Fragment, null, error && jsx(FieldsetError, {
        message: error
      }), jsx("div", null, options.showTitle && jsx("h5", null, label), jsx(FormContent, {
        fields: selectedFields,
        parentName: name,
        extensionManifest: extensionManifest,
        parameters: currentParameters,
        canRemoveFields: field.options.isDynamic && visibleFields.size > 1,
        onClickRemove: this.onClickRemove,
        onFieldChange: onFieldChange,
        firstVisibleFieldName: firstVisibleFieldName
      }), children && jsx("div", {
        css: actionsWrapper,
        "data-testId": "fieldset-actions"
      }, children)));
    }
  }]);

  return FieldsetField;
}(React.Component);

function FieldsetError(_ref) {
  var message = _ref.message;
  return jsx("div", {
    css: sectionMessageWrapper
  }, jsx(SectionMessage, {
    appearance: "error"
  }, jsx("p", null, message)));
}

var sectionMessageWrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  margin-bottom: 24px;\n"])));
export default injectIntl(FieldsetField);