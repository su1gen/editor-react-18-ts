"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AlignmentToolbar = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-down"));

var _ToolbarButton = _interopRequireDefault(require("../../../../ui/ToolbarButton"));

var _Dropdown = _interopRequireDefault(require("../../../../ui/Dropdown"));

var _Alignment = _interopRequireDefault(require("../../../../ui/Alignment"));

var _styles = require("./styles");

var _iconMap = require("./icon-map");

var _messages = require("./messages");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var AlignmentToolbar = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(AlignmentToolbar, _React$Component);

  var _super = _createSuper(AlignmentToolbar);

  function AlignmentToolbar() {
    var _this;

    (0, _classCallCheck2.default)(this, AlignmentToolbar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      isOpen: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "changeAlignment", function (align) {
      _this.toggleOpen();

      return _this.props.changeAlignment(align);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "toggleOpen", function () {
      _this.handleOpenChange({
        isOpen: !_this.state.isOpen
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOpenChange", function (_ref) {
      var isOpen = _ref.isOpen;

      _this.setState({
        isOpen: isOpen
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "hide", function () {
      if (_this.state.isOpen) {
        _this.setState({
          isOpen: false
        });
      }
    });
    return _this;
  }

  (0, _createClass2.default)(AlignmentToolbar, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var isOpen = this.state.isOpen;
      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          isReducedSpacing = _this$props.isReducedSpacing,
          pluginState = _this$props.pluginState,
          disabled = _this$props.disabled,
          intl = _this$props.intl;
      var title = intl.formatMessage(_messages.messages.alignment);
      return (0, _react2.jsx)("span", {
        css: _styles.wrapper
      }, (0, _react2.jsx)(_Dropdown.default, {
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        scrollableElement: popupsScrollableElement,
        isOpen: isOpen,
        handleClickOutside: this.hide,
        handleEscapeKeydown: this.hide,
        fitWidth: 112,
        fitHeight: 80,
        trigger: (0, _react2.jsx)(_ToolbarButton.default, {
          spacing: isReducedSpacing ? 'none' : 'default',
          disabled: disabled,
          selected: isOpen,
          title: title,
          className: "align-btn",
          "aria-label": title,
          "aria-expanded": isOpen,
          "aria-haspopup": true,
          onClick: this.toggleOpen,
          iconBefore: (0, _react2.jsx)("div", {
            css: _styles.triggerWrapper
          }, (0, _react2.jsx)(_iconMap.IconMap, {
            alignment: pluginState.align
          }), (0, _react2.jsx)("span", {
            css: _styles.expandIconWrapper
          }, (0, _react2.jsx)(_chevronDown.default, {
            label: ""
          })))
        })
      }, (0, _react2.jsx)(_Alignment.default, {
        onClick: function onClick(align) {
          return _this2.changeAlignment(align);
        },
        selectedAlignment: pluginState.align
      })), (0, _react2.jsx)("span", {
        css: _styles.separator
      }));
    }
  }]);
  return AlignmentToolbar;
}(_react.default.Component);

exports.AlignmentToolbar = AlignmentToolbar;
(0, _defineProperty2.default)(AlignmentToolbar, "displayName", 'AlignmentToolbar');

var _default = (0, _reactIntlNext.injectIntl)(AlignmentToolbar);

exports.default = _default;