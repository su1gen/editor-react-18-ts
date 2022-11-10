"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _sectionMessage = _interopRequireDefault(require("@atlaskit/section-message"));

var _customThemeButton = _interopRequireDefault(require("@atlaskit/button/custom-theme-button"));

var _select = _interopRequireDefault(require("@atlaskit/select"));

var _addCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/add-circle"));

var _messages = require("../messages");

var _FormContent = _interopRequireDefault(require("../FormContent"));

var _utils = require("../utils");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var actionsWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  border-top: 1px solid ", ";\n  margin-top: ", "px;\n  padding-top: ", "px;\n"])), (0, _tokens.token)('color.border', _colors.N40A), (0, _constants.gridSize)() * 2, (0, _constants.gridSize)() * 2);

var populateFromParameters = function populateFromParameters(parameters, fields) {
  if (Object.keys(parameters).length) {
    var keys = Object.keys(parameters);
    var existingFieldKeys = keys.filter(function (key) {
      return fields.find(function (field) {
        return field.name === (0, _utils.getNameFromDuplicateField)(key);
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
    dynamicFields.push.apply(dynamicFields, (0, _toConsumableArray2.default)(fromRequired));
  }

  var fromParameters = populateFromParameters(parameters, fields);

  if (fromParameters) {
    dynamicFields.push.apply(dynamicFields, (0, _toConsumableArray2.default)(fromParameters));
  }

  if (dynamicFields.length === 0 && Array.isArray(fields) && fields.length > 0) {
    dynamicFields.push(fields[0].name);
  }

  return new Set(dynamicFields);
};

var FieldsetField = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(FieldsetField, _React$Component);

  var _super = _createSuper(FieldsetField);

  function FieldsetField(props) {
    var _this;

    (0, _classCallCheck2.default)(this, FieldsetField);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getSelectedFields", function (visibleFields) {
      var field = _this.props.field;
      return (0, _toConsumableArray2.default)(visibleFields).map(function (fieldName) {
        var originalFieldDef = field.fields.find(function (field) {
          return field.name === (0, _utils.getNameFromDuplicateField)(fieldName);
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getSelectOptions", function (visibleFields) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setIsAdding", function (value) {
      _this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          isAdding: value
        });
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setCurrentParameters", function (parameters) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setVisibleFields", function (fields) {
      _this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          visibleFields: fields,
          selectedFields: _this.getSelectedFields(fields),
          selectOptions: _this.getSelectOptions(fields)
        });
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onSelectItem", function (option) {
      var visibleFields = _this.state.visibleFields;
      var newItem = option.value;
      var duplicates = (0, _toConsumableArray2.default)(visibleFields).filter(function (field) {
        return (0, _utils.getNameFromDuplicateField)(field) === newItem;
      });

      if (duplicates.length > 0) {
        newItem += ":".concat(duplicates.length);
      }

      _this.setVisibleFields(new Set([].concat((0, _toConsumableArray2.default)(visibleFields), [newItem])));

      _this.setIsAdding(false);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onClickRemove", function (fieldName) {
      var _this$state = _this.state,
          visibleFields = _this$state.visibleFields,
          currentParameters = _this$state.currentParameters;
      visibleFields.delete(fieldName);

      _this.setVisibleFields(new Set(visibleFields));

      var newParameters = _objectSpread({}, currentParameters);

      delete newParameters[fieldName]; // if any there are duplicate fields that come after the one removed, we want to reduce their
      // duplicate index eg. label:2 -> label:1

      if ((0, _utils.isDuplicateField)(fieldName)) {
        var _fieldName$split = fieldName.split(':'),
            _fieldName$split2 = (0, _slicedToArray2.default)(_fieldName$split, 2),
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderActions", function () {
      var intl = _this.props.intl;
      var _this$state2 = _this.state,
          selectOptions = _this$state2.selectOptions,
          isAdding = _this$state2.isAdding;

      if (selectOptions.length === 0) {
        return null;
      }

      return (0, _react2.jsx)(_react.default.Fragment, null, isAdding ? (0, _react2.jsx)(_select.default, {
        testId: "field-picker",
        defaultMenuIsOpen: true,
        autoFocus: true,
        placeholder: intl.formatMessage(_messages.messages.addField),
        options: selectOptions,
        onChange: function onChange(option) {
          if (option) {
            _this.onSelectItem(option);
          }
        }
      }) : (0, _react2.jsx)(_customThemeButton.default, {
        testId: "add-more",
        appearance: "subtle",
        iconBefore: (0, _react2.jsx)(_addCircle.default, {
          size: "small",
          label: intl.formatMessage(_messages.messages.addField)
        }),
        onClick: function onClick() {
          return _this.setIsAdding(true);
        }
      }, intl.formatMessage(_messages.messages.addField)));
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

  (0, _createClass2.default)(FieldsetField, [{
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
      return (0, _react2.jsx)(_react.Fragment, null, error && (0, _react2.jsx)(FieldsetError, {
        message: error
      }), (0, _react2.jsx)("div", null, options.showTitle && (0, _react2.jsx)("h5", null, label), (0, _react2.jsx)(_FormContent.default, {
        fields: selectedFields,
        parentName: name,
        extensionManifest: extensionManifest,
        parameters: currentParameters,
        canRemoveFields: field.options.isDynamic && visibleFields.size > 1,
        onClickRemove: this.onClickRemove,
        onFieldChange: onFieldChange,
        firstVisibleFieldName: firstVisibleFieldName
      }), children && (0, _react2.jsx)("div", {
        css: actionsWrapper,
        "data-testId": "fieldset-actions"
      }, children)));
    }
  }]);
  return FieldsetField;
}(_react.default.Component);

function FieldsetError(_ref) {
  var message = _ref.message;
  return (0, _react2.jsx)("div", {
    css: sectionMessageWrapper
  }, (0, _react2.jsx)(_sectionMessage.default, {
    appearance: "error"
  }, (0, _react2.jsx)("p", null, message)));
}

var sectionMessageWrapper = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  margin-bottom: 24px;\n"])));

var _default = (0, _reactIntlNext.injectIntl)(FieldsetField);

exports.default = _default;