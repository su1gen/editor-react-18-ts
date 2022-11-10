"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

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

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _styles = require("./styles");

var _reactIntlNext = require("react-intl-next");

var _messages = require("./messages");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ChromeCollapsed = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(ChromeCollapsed, _PureComponent);

  var _super = _createSuper(ChromeCollapsed);

  function ChromeCollapsed() {
    var _this;

    (0, _classCallCheck2.default)(this, ChromeCollapsed);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "focusHandler", function (evt) {
      /**
       * We need this magic for FireFox.
       * The reason we need it is, when, in FireFox, we have focus inside input,
       * and then we remove that input and move focus to another place programmatically,
       * for whatever reason UP/DOWN arrows don't work until you blur and focus editor manually.
       */
      if (_this.input) {
        _this.input.blur();
      }

      if (_this.props.onFocus) {
        _this.props.onFocus(evt);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleInputRef", function (ref) {
      _this.input = ref;
    });
    return _this;
  }

  (0, _createClass2.default)(ChromeCollapsed, [{
    key: "render",
    value: function render() {
      var placeholder = this.props.text || this.props.intl.formatMessage(_messages.messages.chromeCollapsedPlaceholder);
      return (0, _react2.jsx)("input", {
        css: _styles.inputStyle,
        ref: this.handleInputRef,
        onFocus: this.focusHandler,
        placeholder: placeholder
      });
    }
  }]);
  return ChromeCollapsed;
}(_react.PureComponent);

var _default = (0, _reactIntlNext.injectIntl)(ChromeCollapsed);

exports.default = _default;