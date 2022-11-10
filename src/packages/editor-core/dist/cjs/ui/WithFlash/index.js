"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var pulseBackground = (0, _react2.keyframes)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  50% {\n    background-color: ", ";\n  }\n"])), (0, _tokens.token)('color.blanket.danger', _colors.R100));
var pulseBackgroundReverse = (0, _react2.keyframes)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  0% {\n    background-color: ", ";\n  }\n  50% {\n    background-color: auto;\n  }\n  100% {\n    background-color: ", ";\n  }\n"])), (0, _tokens.token)('color.blanket.danger', _colors.R100), (0, _tokens.token)('color.blanket.danger', _colors.R100));
var flashWrapper = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  &.-flash > div {\n    animation: 0.25s ease-in-out ", ";\n  }\n\n  & > div {\n    animation: 'none';\n  }\n"])), pulseBackgroundReverse);
var flashWrapperAnimated = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n\n  & > div {\n    animation: 0.25s ease-in-out ", ";\n  }\n"])), flashWrapper, pulseBackground);

var WithFlash = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(WithFlash, _React$Component);

  var _super = _createSuper(WithFlash);

  function WithFlash() {
    var _this;

    (0, _classCallCheck2.default)(this, WithFlash);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "toggle", false);
    return _this;
  }

  (0, _createClass2.default)(WithFlash, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          animate = _this$props.animate,
          children = _this$props.children;
      this.toggle = animate && !this.toggle;
      return (0, _react2.jsx)("div", {
        css: animate ? flashWrapperAnimated : flashWrapper,
        className: this.toggle ? '-flash' : ''
      }, children);
    }
  }]);
  return WithFlash;
}(_react.default.Component);

exports.default = WithFlash;