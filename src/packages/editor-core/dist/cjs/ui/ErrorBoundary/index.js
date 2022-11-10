"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBoundary = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _analytics = require("../../plugins/analytics");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ErrorBoundary, _React$Component);

  var _super = _createSuper(ErrorBoundary);

  function ErrorBoundary() {
    var _this;

    (0, _classCallCheck2.default)(this, ErrorBoundary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      errorCaptured: false
    });
    return _this;
  }

  (0, _createClass2.default)(ErrorBoundary, [{
    key: "hasFallback",
    value: function hasFallback() {
      return typeof this.props.fallbackComponent !== 'undefined';
    }
  }, {
    key: "shouldRecover",
    value: function shouldRecover() {
      return this.hasFallback() && this.state.errorCaptured;
    }
  }, {
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      if (this.props.dispatchAnalyticsEvent) {
        this.props.dispatchAnalyticsEvent({
          action: _analytics.ACTION.EDITOR_CRASHED,
          actionSubject: this.props.component,
          actionSubjectId: this.props.componentId,
          eventType: _analytics.EVENT_TYPE.OPERATIONAL,
          attributes: {
            error: error,
            errorInfo: errorInfo,
            // @ts-expect-error
            errorRethrown: !this.hasFallback()
          }
        });
      }

      if (this.hasFallback()) {
        this.setState({
          errorCaptured: true
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.shouldRecover()) {
        return this.props.fallbackComponent;
      }

      return this.props.children;
    }
  }]);
  return ErrorBoundary;
}(_react.default.Component);

exports.ErrorBoundary = ErrorBoundary;