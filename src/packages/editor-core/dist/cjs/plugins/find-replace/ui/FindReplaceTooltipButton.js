"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindReplaceTooltipButton = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _tooltip = _interopRequireDefault(require("@atlaskit/tooltip"));

var _keymaps = require("../../../keymaps");

var _standardButton = _interopRequireDefault(require("@atlaskit/button/standard-button"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var FindReplaceTooltipButton = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(FindReplaceTooltipButton, _React$PureComponent);

  var _super = _createSuper(FindReplaceTooltipButton);

  function FindReplaceTooltipButton() {
    var _this;

    (0, _classCallCheck2.default)(this, FindReplaceTooltipButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "buttonRef", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClick", function () {
      _this.props.onClick(_this.buttonRef);
    });
    return _this;
  }

  (0, _createClass2.default)(FindReplaceTooltipButton, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          icon = _this$props.icon,
          keymapDescription = _this$props.keymapDescription,
          disabled = _this$props.disabled,
          isPressed = _this$props.isPressed;

      var pressedProps = _objectSpread({}, typeof isPressed === 'boolean' && {
        'aria-pressed': isPressed
      });

      return /*#__PURE__*/_react.default.createElement(_tooltip.default, {
        content: /*#__PURE__*/_react.default.createElement(_keymaps.ToolTipContent, {
          description: title,
          keymap: (0, _keymaps.findKeymapByDescription)(keymapDescription)
        }),
        hideTooltipOnClick: true,
        position: 'top'
      }, /*#__PURE__*/_react.default.createElement(_standardButton.default, (0, _extends2.default)({
        label: title,
        appearance: "subtle",
        testId: title,
        ref: this.buttonRef,
        iconBefore: icon,
        isDisabled: disabled,
        onClick: this.handleClick,
        isSelected: isPressed,
        shouldFitContainer: true
      }, pressedProps)));
    }
  }]);
  return FindReplaceTooltipButton;
}(_react.default.PureComponent);

exports.FindReplaceTooltipButton = FindReplaceTooltipButton;
(0, _defineProperty2.default)(FindReplaceTooltipButton, "defaultProps", {
  keymapDescription: 'no-keymap'
});