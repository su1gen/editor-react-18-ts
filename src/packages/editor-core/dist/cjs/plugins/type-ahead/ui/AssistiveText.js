"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssistiveText = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var statusDebounceMillis = 1400;
var assitiveTextStyles = (0, _react2.css)({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  marginbottom: '-1px',
  marginright: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whitespace: 'nowrap',
  width: '1px'
});

var AssistveTextComponent = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(AssistveTextComponent, _React$Component);

  var _super = _createSuper(AssistveTextComponent);

  function AssistveTextComponent() {
    var _this;

    (0, _classCallCheck2.default)(this, AssistveTextComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      bump: false,
      //when the same text needs to be read again, Hence it needs to be toggled between __status--A and __status--B
      debounced: false,
      silenced: false
    });
    return _this;
  }

  (0, _createClass2.default)(AssistveTextComponent, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      this.debounceStatusUpdate = (0, _debounce.default)(function () {
        if (!_this2.state.debounced) {
          var shouldSilence = !_this2.props.isInFocus;

          _this2.setState(function (_ref) {
            var bump = _ref.bump;
            return {
              bump: !bump,
              debounced: true,
              silenced: shouldSilence
            };
          });
        }
      }, statusDebounceMillis);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      this.setState(function (_ref2) {
        var bump = _ref2.bump;
        return {
          bump: !bump,
          debounced: false
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          assistiveText = _this$props.assistiveText,
          id = _this$props.id;
      var _this$state = this.state,
          bump = _this$state.bump,
          debounced = _this$state.debounced,
          silenced = _this$state.silenced;
      this.debounceStatusUpdate();
      return (0, _react2.jsx)("div", {
        css: assitiveTextStyles
      }, (0, _react2.jsx)("div", {
        id: id + '__status--A',
        role: "status",
        "aria-atomic": "true",
        "aria-live": "polite"
      }, "".concat(!silenced && debounced && bump ? assistiveText : '')), (0, _react2.jsx)("div", {
        id: id + '__status--B',
        role: "status",
        "aria-atomic": "true",
        "aria-live": "polite"
      }, "".concat(!silenced && debounced && !bump ? assistiveText : '')));
    }
  }]);
  return AssistveTextComponent;
}(_react.default.Component);

(0, _defineProperty2.default)(AssistveTextComponent, "defaultProps", {
  statusDebounceMillis: 1400,
  debounce: true,
  assistiveText: '',
  isInFocus: false,
  id: ''
});
var AssistiveText = AssistveTextComponent;
exports.AssistiveText = AssistiveText;