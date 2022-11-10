"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextAdapter = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _linkProvider = require("@atlaskit/link-provider");

var _analyticsNextStableReactContext = _interopRequireDefault(require("@atlaskit/analytics-next-stable-react-context"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function useContextMemoized(reactContext) {
  var value = _react.default.useContext(reactContext);

  var context = _react.default.useMemo(function () {
    return {
      Provider: reactContext.Provider,
      Consumer: reactContext.Consumer,
      value: value
    };
  }, [value, reactContext]);

  return context;
} // injects contexts via old context API to children
// and gives access to the original Provider so that
// the child can re-emit it


var ContextAdapter = function ContextAdapter(_ref) {
  var children = _ref.children;
  var card = useContextMemoized(_linkProvider.SmartCardContext);
  var analytics = useContextMemoized(_analyticsNextStableReactContext.default);
  return /*#__PURE__*/_react.default.createElement(LegacyContextAdapter, {
    card: card,
    analytics: analytics
  }, children);
};

exports.ContextAdapter = ContextAdapter;

var LegacyContextAdapter = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(LegacyContextAdapter, _React$PureComponent);

  var _super = _createSuper(LegacyContextAdapter);

  function LegacyContextAdapter() {
    var _this;

    (0, _classCallCheck2.default)(this, LegacyContextAdapter);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "contextState", {});
    return _this;
  }

  (0, _createClass2.default)(LegacyContextAdapter, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        contextAdapter: {
          card: this.props.card,
          analytics: this.props.analytics
        }
      };
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);
  return LegacyContextAdapter;
}(_react.default.PureComponent);

(0, _defineProperty2.default)(LegacyContextAdapter, "childContextTypes", {
  contextAdapter: _propTypes.default.object
});