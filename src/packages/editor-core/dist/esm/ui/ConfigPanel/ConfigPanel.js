import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React, { useCallback, useRef, useEffect } from 'react';
import memoizeOne from 'memoize-one';
import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';
import Form from '@atlaskit/form';
import { isTabGroup } from '@atlaskit/editor-common/extensions';
import _isEqual from 'lodash/isEqual';
import _mergeRecursive from 'lodash/merge';
import { fireAnalyticsEvent, EVENT_TYPE, ACTION_SUBJECT, ACTION } from '../../plugins/analytics';
import LoadingState from './LoadingState';
import Header from './Header';
import ErrorMessage from './ErrorMessage';
import { serialize, deserialize, findDuplicateFields } from './transformers';
import { injectIntl } from 'react-intl-next';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { FormFooter } from '@atlaskit/form';
import { pluginKey as extensionPluginKey } from '../../plugins/extension/plugin-key';
import WithPluginState from '../WithPluginState';
import FormContent from './FormContent';
import { messages } from './messages';
import { FormErrorBoundary } from './FormErrorBoundary';

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
  useEffect(function () {
    if (fields) {
      var firstDuplicateField = findDuplicateFields(fields);

      if (firstDuplicateField) {
        throw new Error("Possible duplicate field name: `".concat(firstDuplicateField.name, "`."));
      }
    }
  }, [fields]);

  if (isLoading || !hasParsedParameters && errorMessage === null) {
    return /*#__PURE__*/React.createElement(LoadingState, null);
  }

  if (errorMessage || !fields) {
    return /*#__PURE__*/React.createElement(ErrorMessage, {
      errorMessage: errorMessage || ''
    });
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormContent, {
    fields: fields,
    parameters: parameters,
    extensionManifest: extensionManifest,
    onFieldChange: onFieldChange,
    firstVisibleFieldName: firstVisibleFieldName,
    contextIdentifierProvider: contextIdentifierProvider
  }), /*#__PURE__*/React.createElement("div", {
    style: canSave ? {} : {
      display: 'none'
    }
  }, /*#__PURE__*/React.createElement(FormFooter, {
    align: "start"
  }, /*#__PURE__*/React.createElement(ButtonGroup, null, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    appearance: "primary"
  }, intl.formatMessage(messages.submit)), /*#__PURE__*/React.createElement(Button, {
    appearance: "default",
    isDisabled: submitting,
    onClick: onCancel
  }, intl.formatMessage(messages.cancel))))));
}

var ConfigFormIntl = injectIntl(ConfigForm);

var WithOnFieldChange = function WithOnFieldChange(_ref2) {
  var getState = _ref2.getState,
      autoSave = _ref2.autoSave,
      handleSubmit = _ref2.handleSubmit,
      children = _ref2.children;
  var getStateRef = useRef(getState);
  useEffect(function () {
    getStateRef.current = getState;
  }, [getState]);
  var handleFieldChange = useCallback(function (name, isDirty) {
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
  _inherits(ConfigPanel, _React$Component);

  var _super = _createSuper(ConfigPanel);

  function ConfigPanel(props) {
    var _this;

    _classCallCheck(this, ConfigPanel);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleKeyDown", function (e) {
      if ((e.key === 'Esc' || e.key === 'Escape') && _this.props.closeOnEsc) {
        _this.props.onCancel();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "backfillTabFormData", function (fields, formData, currentParameters) {
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


      var mergedTabGroups = fields.filter(isTabGroup).reduce(function (missingBackfill, tabGroup) {
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
      return _mergeRecursive({}, mergedTabGroups, formData);
    });

    _defineProperty(_assertThisInitialized(_this), "handleSubmit", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(formData) {
        var _this$props, fields, extensionManifest, onChange, autoSaveReject, serializedData;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
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
                return serialize(extensionManifest, _this.backfillTabFormData(fields, formData, _this.state.currentParameters), fields);

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

    _defineProperty(_assertThisInitialized(_this), "parseParameters", /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(fields, parameters) {
        var extensionManifest, currentParameters;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
                return deserialize(extensionManifest, parameters, fields);

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

    _defineProperty(_assertThisInitialized(_this), "renderHeader", memoizeOne(function (extensionManifest) {
      var _this$props2 = _this.props,
          onCancel = _this$props2.onCancel,
          showHeader = _this$props2.showHeader;

      if (!showHeader) {
        return null;
      }

      return /*#__PURE__*/React.createElement(Header, {
        icon: extensionManifest.icons['48'],
        title: extensionManifest.title,
        description: extensionManifest.description,
        summary: extensionManifest.summary,
        documentationUrl: extensionManifest.documentationUrl,
        onClose: onCancel
      });
    }));

    _defineProperty(_assertThisInitialized(_this), "getFirstVisibleFieldName", memoizeOne(function (fields) {
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

    _defineProperty(_assertThisInitialized(_this), "setFirstVisibleFieldName", function (fields) {
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

  _createClass(ConfigPanel, [{
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
      fireAnalyticsEvent(createAnalyticsEvent)({
        payload: {
          action: ACTION.CLOSED,
          actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
          eventType: EVENT_TYPE.UI,
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

      if (parameters && parameters !== prevProps.parameters || fields && (!prevProps.fields || !_isEqual(fields, prevProps.fields))) {
        this.parseParameters(fields, parameters);
      }

      if (fields && (!prevProps.fields || !_isEqual(fields, prevProps.fields))) {
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
        fireAnalyticsEvent(this.props.createAnalyticsEvent)({
          payload: {
            action: ACTION.OPENED,
            actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
            eventType: EVENT_TYPE.UI,
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
        return /*#__PURE__*/React.createElement(LoadingState, null);
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
      return /*#__PURE__*/React.createElement(Form, {
        onSubmit: handleSubmit
      }, function (_ref5) {
        var formProps = _ref5.formProps,
            getState = _ref5.getState,
            submitting = _ref5.submitting;
        return /*#__PURE__*/React.createElement(WithOnFieldChange, {
          autoSave: !!autoSave,
          getState: getState,
          handleSubmit: handleSubmit
        }, function (onFieldChange) {
          _this2.onFieldChange = onFieldChange;
          return /*#__PURE__*/React.createElement("form", _extends({}, formProps, {
            noValidate: true,
            onKeyDown: handleKeyDown,
            "data-testid": "extension-config-panel"
          }), _this2.renderHeader(extensionManifest), /*#__PURE__*/React.createElement(WithPluginState, {
            plugins: {
              extension: extensionPluginKey
            },
            render: function render(_ref6) {
              var extension = _ref6.extension;
              return /*#__PURE__*/React.createElement(FormErrorBoundary, {
                contextIdentifierProvider: extension === null || extension === void 0 ? void 0 : extension.contextIdentifierProvider,
                extensionKey: extensionManifest.key,
                fields: fields || []
              }, /*#__PURE__*/React.createElement(ConfigFormIntl, {
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
}(React.Component);

export default withAnalyticsContext({
  source: 'ConfigPanel'
})(withAnalyticsEvents()(ConfigPanel));