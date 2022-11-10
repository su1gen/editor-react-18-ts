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

import React from 'react';
import { injectIntl } from 'react-intl-next';
import SectionMessage from '@atlaskit/section-message';
import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../plugins/analytics';
import { editorAnalyticsChannel } from '../../plugins/analytics/consts';
import { messages } from './messages';

var FormErrorBoundaryInner = /*#__PURE__*/function (_React$Component) {
  _inherits(FormErrorBoundaryInner, _React$Component);

  var _super = _createSuper(FormErrorBoundaryInner);

  function FormErrorBoundaryInner() {
    var _this;

    _classCallCheck(this, FormErrorBoundaryInner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      error: undefined
    });

    _defineProperty(_assertThisInitialized(_this), "getProductName", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var contextIdentifierProvider, context;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              contextIdentifierProvider = _this.props.contextIdentifierProvider;

              if (!contextIdentifierProvider) {
                _context.next = 7;
                break;
              }

              _context.next = 4;
              return contextIdentifierProvider;

            case 4:
              context = _context.sent;

              if (!context.product) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", context.product);

            case 7:
              return _context.abrupt("return", 'atlaskit');

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    _defineProperty(_assertThisInitialized(_this), "fireAnalytics", function (analyticsErrorPayload) {
      var _this$props = _this.props,
          createAnalyticsEvent = _this$props.createAnalyticsEvent,
          extensionKey = _this$props.extensionKey,
          fields = _this$props.fields;

      _this.getProductName().then(function (product) {
        var _window, _window$navigator;

        if (!createAnalyticsEvent) {
          // eslint-disable-next-line no-console
          console.error('ConfigPanel FormErrorBoundary: Missing `createAnalyticsEvent`', {
            channel: editorAnalyticsChannel,
            product: product,
            error: analyticsErrorPayload
          });
          return;
        }

        var error = analyticsErrorPayload.error,
            errorInfo = analyticsErrorPayload.errorInfo,
            errorStack = analyticsErrorPayload.errorStack;
        var payload = {
          action: ACTION.ERRORED,
          actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
          eventType: EVENT_TYPE.UI,
          attributes: {
            product: product,
            browserInfo: ((_window = window) === null || _window === void 0 ? void 0 : (_window$navigator = _window.navigator) === null || _window$navigator === void 0 ? void 0 : _window$navigator.userAgent) || 'unknown',
            extensionKey: extensionKey,
            fields: JSON.stringify(fields),
            error: error,
            errorInfo: errorInfo,
            errorStack: errorStack
          }
        };
        createAnalyticsEvent(payload).fire(editorAnalyticsChannel);
      }).catch(function (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to resolve product name from contextIdentifierProvider.', e);
      });
    });

    return _this;
  }

  _createClass(FormErrorBoundaryInner, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      var _this2 = this;

      this.setState({
        error: error
      }, function () {
        // Log the error
        _this2.fireAnalytics({
          error: error.toString(),
          errorInfo: errorInfo,
          errorStack: error.stack
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var intl = this.props.intl;
      var error = this.state.error;

      if (!error) {
        return this.props.children;
      }

      return /*#__PURE__*/React.createElement(SectionMessage, {
        title: intl.formatMessage(messages.errorBoundaryTitle),
        appearance: "error"
      }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", null, error.message)), /*#__PURE__*/React.createElement("p", null, intl.formatMessage(messages.errorBoundaryNote)));
    }
  }]);

  return FormErrorBoundaryInner;
}(React.Component);

export var FormErrorBoundaryImpl = injectIntl(FormErrorBoundaryInner);
export var FormErrorBoundary = withAnalyticsContext()(withAnalyticsEvents()(FormErrorBoundaryImpl));
FormErrorBoundary.displayName = 'FormErrorBoundary';