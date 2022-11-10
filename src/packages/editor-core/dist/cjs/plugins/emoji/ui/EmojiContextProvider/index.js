"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmojiContextProvider = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var EmojiContextProvider = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(EmojiContextProvider, _React$Component);

  var _super = _createSuper(EmojiContextProvider);

  function EmojiContextProvider() {
    (0, _classCallCheck2.default)(this, EmojiContextProvider);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(EmojiContextProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        emoji: {
          emojiProvider: this.props.emojiProvider
        }
      };
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);
  return EmojiContextProvider;
}(_react.default.Component);

exports.EmojiContextProvider = EmojiContextProvider;
(0, _defineProperty2.default)(EmojiContextProvider, "childContextTypes", {
  emoji: _propTypes.default.object
});