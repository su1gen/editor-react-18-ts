"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextPanelWidthProvider = exports.ContextPanelProvider = exports.ContextPanelConsumer = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _React$createContext = /*#__PURE__*/_react.default.createContext({
  width: 0,
  positionedOverEditor: false,
  broadcastWidth: function broadcastWidth() {},
  broadcastPosition: function broadcastPosition() {}
}),
    Provider = _React$createContext.Provider,
    Consumer = _React$createContext.Consumer;

exports.ContextPanelConsumer = Consumer;
exports.ContextPanelProvider = Provider;

var ContextPanelWidthProvider = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ContextPanelWidthProvider, _React$Component);

  var _super = _createSuper(ContextPanelWidthProvider);

  function ContextPanelWidthProvider(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ContextPanelWidthProvider);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      width: 0,
      positionedOverEditor: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "broadcastSidebarWidth", function (width) {
      if (width !== _this.state.width) {
        _this.setState({
          width: width
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "broadcastPosition", function (positionedOverEditor) {
      if (positionedOverEditor !== _this.state.positionedOverEditor) {
        _this.setState({
          positionedOverEditor: positionedOverEditor
        });
      }
    });
    return _this;
  }

  (0, _createClass2.default)(ContextPanelWidthProvider, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          width = _this$state.width,
          positionedOverEditor = _this$state.positionedOverEditor;
      return /*#__PURE__*/_react.default.createElement(Provider, {
        value: {
          width: width,
          positionedOverEditor: positionedOverEditor,
          broadcastWidth: this.broadcastSidebarWidth,
          broadcastPosition: this.broadcastPosition
        }
      }, this.props.children);
    }
  }]);
  return ContextPanelWidthProvider;
}(_react.default.Component);

exports.ContextPanelWidthProvider = ContextPanelWidthProvider;