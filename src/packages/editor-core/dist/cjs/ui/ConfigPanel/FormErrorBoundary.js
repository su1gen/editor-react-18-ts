"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormErrorBoundaryImpl = exports.FormErrorBoundary = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _sectionMessage = _interopRequireDefault(require("@atlaskit/section-message"));

var _analyticsNext = require("@atlaskit/analytics-next");

var _analytics = require("../../plugins/analytics");

var _consts = require("../../plugins/analytics/consts");

var _messages = require("./messages");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var FormErrorBoundaryInner = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(FormErrorBoundaryInner, _React$Component);

  var _super = _createSuper(FormErrorBoundaryInner);

  function FormErrorBoundaryInner() {
    var _this;

    (0, _classCallCheck2.default)(this, FormErrorBoundaryInner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      error: undefined
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getProductName", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var contextIdentifierProvider, context;
      return _regenerator.default.wrap(function _callee$(_context) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "fireAnalytics", function (analyticsErrorPayload) {
      var _this$props = _this.props,
          createAnalyticsEvent = _this$props.createAnalyticsEvent,
          extensionKey = _this$props.extensionKey,
          fields = _this$props.fields;

      _this.getProductName().then(function (product) {
        var _window, _window$navigator;

        if (!createAnalyticsEvent) {
          // eslint-disable-next-line no-console
          console.error('ConfigPanel FormErrorBoundary: Missing `createAnalyticsEvent`', {
            channel: _consts.editorAnalyticsChannel,
            product: product,
            error: analyticsErrorPayload
          });
          return;
        }

        var error = analyticsErrorPayload.error,
            errorInfo = analyticsErrorPayload.errorInfo,
            errorStack = analyticsErrorPayload.errorStack;
        var payload = {
          action: _analytics.ACTION.ERRORED,
          actionSubject: _analytics.ACTION_SUBJECT.CONFIG_PANEL,
          eventType: _analytics.EVENT_TYPE.UI,
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
        createAnalyticsEvent(payload).fire(_consts.editorAnalyticsChannel);
      }).catch(function (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to resolve product name from contextIdentifierProvider.', e);
      });
    });
    return _this;
  }

  (0, _createClass2.default)(FormErrorBoundaryInner, [{
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

      return /*#__PURE__*/_react.default.createElement(_sectionMessage.default, {
        title: intl.formatMessage(_messages.messages.errorBoundaryTitle),
        appearance: "error"
      }, /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("i", null, error.message)), /*#__PURE__*/_react.default.createElement("p", null, intl.formatMessage(_messages.messages.errorBoundaryNote)));
    }
  }]);
  return FormErrorBoundaryInner;
}(_react.default.Component);

var FormErrorBoundaryImpl = (0, _reactIntlNext.injectIntl)(FormErrorBoundaryInner);
exports.FormErrorBoundaryImpl = FormErrorBoundaryImpl;
var FormErrorBoundary = (0, _analyticsNext.withAnalyticsContext)()((0, _analyticsNext.withAnalyticsEvents)()(FormErrorBoundaryImpl));
exports.FormErrorBoundary = FormErrorBoundary;
FormErrorBoundary.displayName = 'FormErrorBoundary';