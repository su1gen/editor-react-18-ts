"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withActivityProvider;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _excluded = ["providerFactory"];

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function withActivityProvider(WrappedComponent) {
  return /*#__PURE__*/function (_React$Component) {
    (0, _inherits2.default)(WithActivityProvider, _React$Component);

    var _super = _createSuper(WithActivityProvider);

    function WithActivityProvider() {
      var _this;

      (0, _classCallCheck2.default)(this, WithActivityProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderNode", function (providers) {
        var _ref = _this.props,
            providerFactory = _ref.providerFactory,
            props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
        var activityProvider = providers.activityProvider;
        return /*#__PURE__*/_react.default.createElement(WrappedComponent, (0, _extends2.default)({
          activityProvider: activityProvider
        }, props));
      });
      return _this;
    }

    (0, _createClass2.default)(WithActivityProvider, [{
      key: "render",
      value: function render() {
        var providerFactory = this.props.providerFactory;
        return /*#__PURE__*/_react.default.createElement(_providerFactory.WithProviders, {
          providers: ['activityProvider'],
          providerFactory: providerFactory,
          renderNode: this.renderNode
        });
      }
    }]);
    return WithActivityProvider;
  }(_react.default.Component);
}