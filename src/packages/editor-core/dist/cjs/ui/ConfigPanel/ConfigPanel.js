"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _analyticsNext = require("@atlaskit/analytics-next");

var _form = _interopRequireWildcard(require("@atlaskit/form"));

var _extensions = require("@atlaskit/editor-common/extensions");

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _merge = _interopRequireDefault(require("lodash/merge"));

var _analytics = require("../../plugins/analytics");

var _LoadingState = _interopRequireDefault(require("./LoadingState"));

var _Header = _interopRequireDefault(require("./Header"));

var _ErrorMessage = _interopRequireDefault(require("./ErrorMessage"));

var _transformers = require("./transformers");

var _reactIntlNext = require("react-intl-next");

var _buttonGroup = _interopRequireDefault(require("@atlaskit/button/button-group"));

var _customThemeButton = _interopRequireDefault(require("@atlaskit/button/custom-theme-button"));

var _pluginKey = require("../../plugins/extension/plugin-key");

var _WithPluginState = _interopRequireDefault(require("../WithPluginState"));

var _FormContent = _interopRequireDefault(require("./FormContent"));

var _messages = require("./messages");

var _FormErrorBoundary = require("./FormErrorBoundary");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ConfigForm(_ref) {
  var canSave = _ref.canSave,
      errorMessage = _ref.errorMessage,
      extensionManifest = _ref.extensionManifest,
      fields = _ref.fields,
      firstVisibleFieldName = _ref.firstVisibleFieldName,
      hasParsedParameters = _ref.hasParsedParameters,
      intl = _ref.intl,
      isLoading = _ref.isLoading,
      onCancel = _ref.onCancel,
      onFieldChange = _ref.onFieldChange,
      parameters = _ref.parameters,
      submitting = _ref.submitting,
      contextIdentifierProvider = _ref.contextIdentifierProvider;
  (0, _react.useEffect)(function () {
    if (fields) {
      var firstDuplicateField = (0, _transformers.findDuplicateFields)(fields);

      if (firstDuplicateField) {
        throw new Error("Possible duplicate field name: `".concat(firstDuplicateField.name, "`."));
      }
    }
  }, [fields]);

  if (isLoading || !hasParsedParameters && errorMessage === null) {
    return /*#__PURE__*/_react.default.createElement(_LoadingState.default, null);
  }

  if (errorMessage || !fields) {
    return /*#__PURE__*/_react.default.createElement(_ErrorMessage.default, {
      errorMessage: errorMessage || ''
    });
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_FormContent.default, {
    fields: fields,
    parameters: parameters,
    extensionManifest: extensionManifest,
    onFieldChange: onFieldChange,
    firstVisibleFieldName: firstVisibleFieldName,
    contextIdentifierProvider: contextIdentifierProvider
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: canSave ? {} : {
      display: 'none'
    }
  }, /*#__PURE__*/_react.default.createElement(_form.FormFooter, {
    align: "start"
  }, /*#__PURE__*/_react.default.createElement(_buttonGroup.default, null, /*#__PURE__*/_react.default.createElement(_customThemeButton.default, {
    type: "submit",
    appearance: "primary"
  }, intl.formatMessage(_messages.messages.submit)), /*#__PURE__*/_react.default.createElement(_customThemeButton.default, {
    appearance: "default",
    isDisabled: submitting,
    onClick: onCancel
  }, intl.formatMessage(_messages.messages.cancel))))));
}

var ConfigFormIntl = (0, _reactIntlNext.injectIntl)(ConfigForm);

var WithOnFieldChange = function WithOnFieldChange(_ref2) {
  var getState = _ref2.getState,
      autoSave = _ref2.autoSave,
      handleSubmit = _ref2.handleSubmit,
      children = _ref2.children;
  var getStateRef = (0, _react.useRef)(getState);
  (0, _react.useEffect)(function () {
    getStateRef.current = getState;
  }, [getState]);
  var handleFieldChange = (0, _react.useCallback)(function (name, isDirty) {
    if (!autoSave) {
      return;
    } // Don't trigger submit if nothing actually changed


    if (!isDirty) {
      return;
    }

    var _getStateRef$current = getStateRef.current(),
        errors = _getStateRef$current.errors,
        values = _getStateRef$current.values; // Get only values that does not contain errors


    var validValues = {};

    for (var _i = 0, _Object$keys = Object.keys(values); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];

      if (!errors[key]) {
        // not has error
        validValues[key] = values[key];
      }
    }

    handleSubmit(validValues);
  }, [autoSave, handleSubmit]);
  return children(handleFieldChange);
};

var ConfigPanel = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ConfigPanel, _React$Component);

  var _super = _createSuper(ConfigPanel);

  function ConfigPanel(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ConfigPanel);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleKeyDown", function (e) {
      if ((e.key === 'Esc' || e.key === 'Escape') && _this.props.closeOnEsc) {
        _this.props.onCancel();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "backfillTabFormData", function (fields, formData, currentParameters) {
      var getRelevantData = function getRelevantData(field, formParams, currentParams, backfill) {
        if (field.hasGroupedValues && !(field.name in backfill)) {
          backfill[field.name] = {};
        }

        var actualFormParams = field.hasGroupedValues ? formParams[field.name] || {} : formParams;
        var actualCurrentParams = field.hasGroupedValues ? currentParams[field.name] || {} : currentParams;
        var actualBackfillParams = field.hasGroupedValues ? backfill[field.name] : backfill;
        return {
          formParams: actualFormParams,
          currentParams: actualCurrentParams,
          backfillParams: actualBackfillParams
        };
      }; // Traverse any tab structures and backfill field values on tabs
      // which aren't shown. This filter should be ok because tabs are
      // currently only allowed on top level


      var mergedTabGroups = fields.filter(_extensions.isTabGroup).reduce(function (missingBackfill, tabGroup) {
        var _getRelevantData = getRelevantData(tabGroup, formData, currentParameters, missingBackfill),
            tabGroupFormData = _getRelevantData.formParams,
            tabGroupCurrentData = _getRelevantData.currentParams,
            tabGroupParams = _getRelevantData.backfillParams; // Loop through tabs and see what fields are missing from current data


        tabGroup.fields.forEach(function (tabField) {
          var _getRelevantData2 = getRelevantData(tabField, tabGroupFormData, tabGroupCurrentData, tabGroupParams),
              tabFormData = _getRelevantData2.formParams,
              tabCurrentData = _getRelevantData2.currentParams,
              tabParams = _getRelevantData2.backfillParams;

          tabField.fields.forEach(function (field) {
            if (field.name in tabFormData || !(field.name in tabCurrentData)) {
              return;
            }

            tabParams[field.name] = tabCurrentData[field.name];
          });
        });
        return missingBackfill;
      }, {});
      return (0, _merge.default)({}, mergedTabGroups, formData);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSubmit", /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(formData) {
        var _this$props, fields, extensionManifest, onChange, autoSaveReject, serializedData;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$props = _this.props, fields = _this$props.fields, extensionManifest = _this$props.extensionManifest, onChange = _this$props.onChange, autoSaveReject = _this$props.autoSaveReject;

                if (!(!extensionManifest || !fields)) {
                  _context.next = 4;
                  break;
                }

                if (!extensionManifest) {
                  autoSaveReject === null || autoSaveReject === void 0 ? void 0 : autoSaveReject(new Error('Extension manifest not loaded'));
                } else if (!fields) {
                  autoSaveReject === null || autoSaveReject === void 0 ? void 0 : autoSaveReject(new Error('Config fields not loaded'));
                }

                return _context.abrupt("return");

              case 4:
                _context.prev = 4;
                _context.next = 7;
                return (0, _transformers.serialize)(extensionManifest, _this.backfillTabFormData(fields, formData, _this.state.currentParameters), fields);

              case 7:
                serializedData = _context.sent;
                onChange(serializedData);
                _context.next = 15;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](4);
                autoSaveReject === null || autoSaveReject === void 0 ? void 0 : autoSaveReject(_context.t0); // eslint-disable-next-line no-console

                console.error("Error serializing parameters", _context.t0);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[4, 11]]);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "parseParameters", /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(fields, parameters) {
        var extensionManifest, currentParameters;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                extensionManifest = _this.props.extensionManifest;

                if (!(!extensionManifest || !fields || fields.length === 0)) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                if (!(typeof parameters === 'undefined')) {
                  _context2.next = 6;
                  break;
                }

                _this.setState({
                  currentParameters: {},
                  hasParsedParameters: true
                });

                return _context2.abrupt("return");

              case 6:
                _context2.next = 8;
                return (0, _transformers.deserialize)(extensionManifest, parameters, fields);

              case 8:
                currentParameters = _context2.sent;

                _this.setState({
                  currentParameters: currentParameters,
                  hasParsedParameters: true
                });

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2, _x3) {
        return _ref4.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderHeader", (0, _memoizeOne.default)(function (extensionManifest) {
      var _this$props2 = _this.props,
          onCancel = _this$props2.onCancel,
          showHeader = _this$props2.showHeader;

      if (!showHeader) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_Header.default, {
        icon: extensionManifest.icons['48'],
        title: extensionManifest.title,
        description: extensionManifest.description,
        summary: extensionManifest.summary,
        documentationUrl: extensionManifest.documentationUrl,
        onClose: onCancel
      });
    }));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getFirstVisibleFieldName", (0, _memoizeOne.default)(function (fields) {
      function nonHidden(field) {
        if ('isHidden' in field) {
          return !field.isHidden;
        }

        return true;
      } // finds the first visible field, true for FieldSets too


      var firstVisibleField = fields.find(nonHidden);
      var newFirstVisibleFieldName;

      if (firstVisibleField) {
        // if it was a fieldset, go deeper trying to locate the field
        if (firstVisibleField.type === 'fieldset') {
          var firstVisibleFieldWithinFieldset = firstVisibleField.fields.find(nonHidden);
          newFirstVisibleFieldName = firstVisibleFieldWithinFieldset && firstVisibleFieldWithinFieldset.name;
        } else {
          newFirstVisibleFieldName = firstVisibleField.name;
        }
      }

      return newFirstVisibleFieldName;
    }));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setFirstVisibleFieldName", function (fields) {
      var newFirstVisibleFieldName = _this.getFirstVisibleFieldName(fields);

      if (newFirstVisibleFieldName !== _this.state.firstVisibleFieldName) {
        _this.setState({
          firstVisibleFieldName: newFirstVisibleFieldName
        });
      }
    });
    _this.state = {
      hasParsedParameters: false,
      currentParameters: {},
      firstVisibleFieldName: props.fields ? _this.getFirstVisibleFieldName(props.fields) : undefined
    };
    _this.onFieldChange = null;
    return _this;
  }

  (0, _createClass2.default)(ConfigPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props3 = this.props,
          fields = _this$props3.fields,
          parameters = _this$props3.parameters;
      this.parseParameters(fields, parameters);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$props4 = this.props,
          createAnalyticsEvent = _this$props4.createAnalyticsEvent,
          extensionManifest = _this$props4.extensionManifest;
      (0, _analytics.fireAnalyticsEvent)(createAnalyticsEvent)({
        payload: {
          action: _analytics.ACTION.CLOSED,
          actionSubject: _analytics.ACTION_SUBJECT.CONFIG_PANEL,
          eventType: _analytics.EVENT_TYPE.UI,
          attributes: {
            extensionKey: extensionManifest === null || extensionManifest === void 0 ? void 0 : extensionManifest.key,
            extensionType: extensionManifest === null || extensionManifest === void 0 ? void 0 : extensionManifest.type
          }
        }
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props5 = this.props,
          parameters = _this$props5.parameters,
          fields = _this$props5.fields,
          autoSaveTrigger = _this$props5.autoSaveTrigger,
          extensionManifest = _this$props5.extensionManifest;

      if (parameters && parameters !== prevProps.parameters || fields && (!prevProps.fields || !(0, _isEqual2.default)(fields, prevProps.fields))) {
        this.parseParameters(fields, parameters);
      }

      if (fields && (!prevProps.fields || !(0, _isEqual2.default)(fields, prevProps.fields))) {
        this.setFirstVisibleFieldName(fields);
      }

      if (prevProps.autoSaveTrigger !== autoSaveTrigger) {
        if (this.onFieldChange) {
          this.onFieldChange('', true);
        }
      }

      if (prevProps.extensionManifest === undefined && prevProps.extensionManifest !== extensionManifest) {
        // This will only be fired once when extensionManifest is loaded initially
        // Can't do this in componentDidMount because extensionManifest is still undefined at that point
        (0, _analytics.fireAnalyticsEvent)(this.props.createAnalyticsEvent)({
          payload: {
            action: _analytics.ACTION.OPENED,
            actionSubject: _analytics.ACTION_SUBJECT.CONFIG_PANEL,
            eventType: _analytics.EVENT_TYPE.UI,
            attributes: {
              extensionKey: extensionManifest === null || extensionManifest === void 0 ? void 0 : extensionManifest.key,
              extensionType: extensionManifest === null || extensionManifest === void 0 ? void 0 : extensionManifest.type
            }
          }
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var extensionManifest = this.props.extensionManifest;

      if (!extensionManifest) {
        return /*#__PURE__*/_react.default.createElement(_LoadingState.default, null);
      }

      var _this$props6 = this.props,
          autoSave = _this$props6.autoSave,
          errorMessage = _this$props6.errorMessage,
          fields = _this$props6.fields,
          isLoading = _this$props6.isLoading,
          onCancel = _this$props6.onCancel;
      var _this$state = this.state,
          currentParameters = _this$state.currentParameters,
          hasParsedParameters = _this$state.hasParsedParameters,
          firstVisibleFieldName = _this$state.firstVisibleFieldName;
      var handleSubmit = this.handleSubmit,
          handleKeyDown = this.handleKeyDown;
      return /*#__PURE__*/_react.default.createElement(_form.default, {
        onSubmit: handleSubmit
      }, function (_ref5) {
        var formProps = _ref5.formProps,
            getState = _ref5.getState,
            submitting = _ref5.submitting;
        return /*#__PURE__*/_react.default.createElement(WithOnFieldChange, {
          autoSave: !!autoSave,
          getState: getState,
          handleSubmit: handleSubmit
        }, function (onFieldChange) {
          _this2.onFieldChange = onFieldChange;
          return /*#__PURE__*/_react.default.createElement("form", (0, _extends2.default)({}, formProps, {
            noValidate: true,
            onKeyDown: handleKeyDown,
            "data-testid": "extension-config-panel"
          }), _this2.renderHeader(extensionManifest), /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
            plugins: {
              extension: _pluginKey.pluginKey
            },
            render: function render(_ref6) {
              var extension = _ref6.extension;
              return /*#__PURE__*/_react.default.createElement(_FormErrorBoundary.FormErrorBoundary, {
                contextIdentifierProvider: extension === null || extension === void 0 ? void 0 : extension.contextIdentifierProvider,
                extensionKey: extensionManifest.key,
                fields: fields || []
              }, /*#__PURE__*/_react.default.createElement(ConfigFormIntl, {
                canSave: !autoSave,
                errorMessage: errorMessage,
                extensionManifest: extensionManifest,
                fields: fields,
                firstVisibleFieldName: firstVisibleFieldName,
                hasParsedParameters: hasParsedParameters,
                isLoading: isLoading || false,
                onCancel: onCancel,
                onFieldChange: onFieldChange,
                parameters: currentParameters,
                submitting: submitting,
                contextIdentifierProvider: extension === null || extension === void 0 ? void 0 : extension.contextIdentifierProvider
              }));
            }
          }));
        });
      });
    }
  }]);
  return ConfigPanel;
}(_react.default.Component);

var _default = (0, _analyticsNext.withAnalyticsContext)({
  source: 'ConfigPanel'
})((0, _analyticsNext.withAnalyticsEvents)()(ConfigPanel));

exports.default = _default;