import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import memoizeOne from 'memoize-one';
import React from 'react';
import uuid from 'uuid';
import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import { IntlErrorBoundary } from '@atlaskit/editor-common/ui';
import { sniffUserBrowserExtensions } from '@atlaskit/editor-common/utils';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../plugins/analytics';
import { editorAnalyticsChannel } from '../plugins/analytics/consts';
import { getFeatureFlags } from '../plugins/feature-flags-context';
import { getDocStructure } from '../utils/document-logger';
import { WithEditorView } from './WithEditorView';
import { isOutdatedBrowser } from '@atlaskit/editor-common/utils';
export var ErrorBoundaryWithEditorView = /*#__PURE__*/function (_React$Component) {
  _inherits(ErrorBoundaryWithEditorView, _React$Component);

  var _super = _createSuper(ErrorBoundaryWithEditorView);

  function ErrorBoundaryWithEditorView(props) {
    var _this;

    _classCallCheck(this, ErrorBoundaryWithEditorView);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "browserExtensions", undefined);

    _defineProperty(_assertThisInitialized(_this), "state", {
      error: undefined
    });

    _defineProperty(_assertThisInitialized(_this), "getFeatureFlags", memoizeOne(function (editorView) {
      if (!editorView) {
        return {};
      }

      return getFeatureFlags(editorView.state);
    }));

    _defineProperty(_assertThisInitialized(_this), "sendErrorData", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(analyticsErrorPayload) {
        var _window, _window$navigator;

        var product, error, errorInfo, errorStack, sharedId, browserInfo, attributes, _this$experienceStore;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.getProductName();

              case 2:
                product = _context.sent;
                error = analyticsErrorPayload.error, errorInfo = analyticsErrorPayload.errorInfo, errorStack = analyticsErrorPayload.errorStack;
                sharedId = uuid();
                browserInfo = ((_window = window) === null || _window === void 0 ? void 0 : (_window$navigator = _window.navigator) === null || _window$navigator === void 0 ? void 0 : _window$navigator.userAgent) || 'unknown';
                attributes = {
                  product: product,
                  browserInfo: browserInfo,
                  error: error,
                  errorInfo: errorInfo,
                  errorId: sharedId,
                  browserExtensions: _this.browserExtensions,
                  docStructure: _this.featureFlags.errorBoundaryDocStructure && _this.props.editorView ? getDocStructure(_this.props.editorView.state.doc, {
                    compact: true
                  }) : undefined,
                  outdatedBrowser: isOutdatedBrowser(browserInfo)
                };

                _this.fireAnalyticsEvent({
                  action: ACTION.EDITOR_CRASHED,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  eventType: EVENT_TYPE.OPERATIONAL,
                  attributes: attributes
                });

                _this.fireAnalyticsEvent({
                  action: ACTION.EDITOR_CRASHED_ADDITIONAL_INFORMATION,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  eventType: EVENT_TYPE.OPERATIONAL,
                  attributes: {
                    errorStack: errorStack,
                    errorId: sharedId
                  }
                });

                if (_this.featureFlags.ufo && _this.props.editorView) {
                  (_this$experienceStore = _this.experienceStore) === null || _this$experienceStore === void 0 ? void 0 : _this$experienceStore.failAll(_objectSpread(_objectSpread({}, _this.getExperienceMetadata(attributes)), {}, {
                    errorStack: errorStack
                  }));
                }

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "getProductName", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var contextIdentifierProvider, context;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              contextIdentifierProvider = _this.props.contextIdentifierProvider;

              if (!contextIdentifierProvider) {
                _context2.next = 7;
                break;
              }

              _context2.next = 4;
              return contextIdentifierProvider;

            case 4:
              context = _context2.sent;

              if (!context.product) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("return", context.product);

            case 7:
              return _context2.abrupt("return", 'atlaskit');

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));

    _defineProperty(_assertThisInitialized(_this), "fireAnalyticsEvent", function (event) {
      var _this$props$createAna, _this$props;

      (_this$props$createAna = (_this$props = _this.props).createAnalyticsEvent) === null || _this$props$createAna === void 0 ? void 0 : _this$props$createAna.call(_this$props, event).fire(editorAnalyticsChannel);
    });

    _defineProperty(_assertThisInitialized(_this), "getExperienceMetadata", function (attributes) {
      var _attributes$browserEx;

      return {
        browserInfo: attributes.browserInfo,
        error: attributes.error.toString(),
        errorInfo: {
          componentStack: attributes.errorInfo.componentStack
        },
        errorId: attributes.errorId,
        browserExtensions: (_attributes$browserEx = attributes.browserExtensions) === null || _attributes$browserEx === void 0 ? void 0 : _attributes$browserEx.toString(),
        docStructure: attributes.docStructure
      };
    });

    if (props.editorView) {
      _this.experienceStore = ExperienceStore.getInstance(props.editorView);
    }

    return _this;
  }

  _createClass(ErrorBoundaryWithEditorView, [{
    key: "featureFlags",
    get: // Memoizing this as react alternative suggestion of https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    function get() {
      return this.getFeatureFlags(this.props.editorView);
    }
  }, {
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      var _this2 = this;

      this.sendErrorData({
        error: error.toString(),
        errorInfo: errorInfo,
        errorStack: error.stack
      }); // // Update state to allow a re-render to attempt graceful recovery (in the event that
      // // the error was caused by a race condition or is intermittent)

      this.setState({
        error: error
      }, function () {
        if (_this2.props.rethrow) {
          // Now that a re-render has occured, we re-throw to allow product error boundaries
          // to catch and handle the error too.
          //
          // Note that when rethrowing inside a error boundary, the stack trace
          // from a higher error boundary's componentDidCatch.info param will reset
          // to this component, instead of the original component which threw it.
          throw error;
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return sniffUserBrowserExtensions({
                  extensions: ['grammarly'],
                  async: true,
                  asyncTimeoutMs: 20000
                });

              case 2:
                this.browserExtensions = _context3.sent;

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(IntlErrorBoundary, null, this.props.children);
    }
  }]);

  return ErrorBoundaryWithEditorView;
}(React.Component);

_defineProperty(ErrorBoundaryWithEditorView, "defaultProps", {
  rethrow: true
});

export default WithEditorView(ErrorBoundaryWithEditorView);