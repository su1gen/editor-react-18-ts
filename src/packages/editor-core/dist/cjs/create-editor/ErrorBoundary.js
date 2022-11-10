"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ErrorBoundaryWithEditorView = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _react = _interopRequireDefault(require("react"));

var _uuid = _interopRequireDefault(require("uuid"));

var _ufo = require("@atlaskit/editor-common/ufo");

var _ui = require("@atlaskit/editor-common/ui");

var _utils = require("@atlaskit/editor-common/utils");

var _analytics = require("../plugins/analytics");

var _consts = require("../plugins/analytics/consts");

var _featureFlagsContext = require("../plugins/feature-flags-context");

var _documentLogger = require("../utils/document-logger");

var _WithEditorView = require("./WithEditorView");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ErrorBoundaryWithEditorView = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ErrorBoundaryWithEditorView, _React$Component);

  var _super = _createSuper(ErrorBoundaryWithEditorView);

  function ErrorBoundaryWithEditorView(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ErrorBoundaryWithEditorView);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "browserExtensions", undefined);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      error: undefined
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getFeatureFlags", (0, _memoizeOne.default)(function (editorView) {
      if (!editorView) {
        return {};
      }

      return (0, _featureFlagsContext.getFeatureFlags)(editorView.state);
    }));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "sendErrorData", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(analyticsErrorPayload) {
        var _window, _window$navigator;

        var product, error, errorInfo, errorStack, sharedId, browserInfo, attributes, _this$experienceStore;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.getProductName();

              case 2:
                product = _context.sent;
                error = analyticsErrorPayload.error, errorInfo = analyticsErrorPayload.errorInfo, errorStack = analyticsErrorPayload.errorStack;
                sharedId = (0, _uuid.default)();
                browserInfo = ((_window = window) === null || _window === void 0 ? void 0 : (_window$navigator = _window.navigator) === null || _window$navigator === void 0 ? void 0 : _window$navigator.userAgent) || 'unknown';
                attributes = {
                  product: product,
                  browserInfo: browserInfo,
                  error: error,
                  errorInfo: errorInfo,
                  errorId: sharedId,
                  browserExtensions: _this.browserExtensions,
                  docStructure: _this.featureFlags.errorBoundaryDocStructure && _this.props.editorView ? (0, _documentLogger.getDocStructure)(_this.props.editorView.state.doc, {
                    compact: true
                  }) : undefined,
                  outdatedBrowser: (0, _utils.isOutdatedBrowser)(browserInfo)
                };

                _this.fireAnalyticsEvent({
                  action: _analytics.ACTION.EDITOR_CRASHED,
                  actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
                  eventType: _analytics.EVENT_TYPE.OPERATIONAL,
                  attributes: attributes
                });

                _this.fireAnalyticsEvent({
                  action: _analytics.ACTION.EDITOR_CRASHED_ADDITIONAL_INFORMATION,
                  actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
                  eventType: _analytics.EVENT_TYPE.OPERATIONAL,
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getProductName", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      var contextIdentifierProvider, context;
      return _regenerator.default.wrap(function _callee2$(_context2) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "fireAnalyticsEvent", function (event) {
      var _this$props$createAna, _this$props;

      (_this$props$createAna = (_this$props = _this.props).createAnalyticsEvent) === null || _this$props$createAna === void 0 ? void 0 : _this$props$createAna.call(_this$props, event).fire(_consts.editorAnalyticsChannel);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getExperienceMetadata", function (attributes) {
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
      _this.experienceStore = _ufo.ExperienceStore.getInstance(props.editorView);
    }

    return _this;
  }

  (0, _createClass2.default)(ErrorBoundaryWithEditorView, [{
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
      var _componentDidMount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _utils.sniffUserBrowserExtensions)({
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
      return /*#__PURE__*/_react.default.createElement(_ui.IntlErrorBoundary, null, this.props.children);
    }
  }]);
  return ErrorBoundaryWithEditorView;
}(_react.default.Component);

exports.ErrorBoundaryWithEditorView = ErrorBoundaryWithEditorView;
(0, _defineProperty2.default)(ErrorBoundaryWithEditorView, "defaultProps", {
  rethrow: true
});

var _default = (0, _WithEditorView.WithEditorView)(ErrorBoundaryWithEditorView);

exports.default = _default;