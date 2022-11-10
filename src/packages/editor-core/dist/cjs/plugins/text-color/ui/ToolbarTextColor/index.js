"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.default = exports.ToolbarTextColor = void 0;

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

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-down"));

var _ColorPalette = _interopRequireDefault(require("../../../../ui/ColorPalette"));

var _textColorPalette = require("../../../../ui/ColorPalette/Palettes/textColorPalette");

var _Dropdown = _interopRequireDefault(require("../../../../ui/Dropdown"));

var _styles = require("../../../../ui/styles");

var _ToolbarButton = _interopRequireWildcard(require("../../../../ui/ToolbarButton"));

var _analytics = require("../../../analytics");

var commands = _interopRequireWildcard(require("../../commands/change-color"));

var _icon = require("./icon");

var _styles2 = require("./styles");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var EXPERIMENT_NAME = 'editor.toolbarTextColor.moreColors';
var EXPERIMENT_GROUP_CONTROL = 'control';
var messages = (0, _reactIntlNext.defineMessages)({
  textColor: {
    id: 'fabric.editor.textColor',
    defaultMessage: 'Text color',
    description: ''
  }
});
exports.messages = messages;

var ToolbarTextColor = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ToolbarTextColor, _React$Component);

  var _super = _createSuper(ToolbarTextColor);

  function ToolbarTextColor() {
    var _this;

    (0, _classCallCheck2.default)(this, ToolbarTextColor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      isOpen: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "changeColor", function (color) {
      return commands.changeColor(color)(_this.props.editorView.state, _this.props.editorView.dispatch);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "changeTextColor", function (color, disabled) {
      if (!disabled) {
        var _this$props$pluginSta = _this.props.pluginState,
            palette = _this$props$pluginSta.palette,
            paletteExpanded = _this$props$pluginSta.paletteExpanded,
            defaultColor = _this$props$pluginSta.defaultColor; // we store color names in analytics

        var swatch = (paletteExpanded || palette).find(function (sw) {
          return sw.value === color;
        });
        var isNewColor = color !== defaultColor && !_textColorPalette.textColorPalette.some(function (col) {
          return col.value === color;
        });

        _this.dispatchAnalyticsEvent(_this.buildAnalyticsSelectColor({
          color: (swatch ? swatch.label : color).toLowerCase(),
          isNewColor: isNewColor
        }));

        _this.handleOpenChange({
          isOpen: false,
          logCloseEvent: false
        });

        return _this.changeColor(color);
      }

      return false;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "toggleOpen", function () {
      _this.handleOpenChange({
        isOpen: !_this.state.isOpen,
        logCloseEvent: true
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOpenChange", function (_ref) {
      var isOpen = _ref.isOpen,
          logCloseEvent = _ref.logCloseEvent;

      _this.setState({
        isOpen: isOpen
      });

      if (logCloseEvent) {
        _this.dispatchAnalyticsEvent(_this.buildAnalyticsPalette(isOpen ? _analytics.ACTION.OPENED : _analytics.ACTION.CLOSED, {
          noSelect: isOpen === false
        }));
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "hide", function (e) {
      var isOpen = _this.state.isOpen;

      if (isOpen === true) {
        _this.dispatchAnalyticsEvent(_this.buildAnalyticsPalette(_analytics.ACTION.CLOSED, {
          noSelect: true
        }));

        _this.setState({
          isOpen: false
        });
      }
    });
    return _this;
  }

  (0, _createClass2.default)(ToolbarTextColor, [{
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
          paletteExpanded = _this$props.pluginState.paletteExpanded,
          formatMessage = _this$props.intl.formatMessage,
          disabled = _this$props.disabled;
      var labelTextColor = formatMessage(messages.textColor);
      var palette = paletteExpanded || pluginState.palette;
      var fitWidth;

      if (document.body.clientWidth <= 740) {
        // This was originally hard-coded, but moved here to a const
        // My guess is it's based off (width of button * columns) + left/right padding
        // 240 = (32 * 7) + (8 + 8)
        // Not sure where the extra 2px comes from
        fitWidth = 242;
      }

      var selectedColor = pluginState.color !== pluginState.defaultColor && pluginState.color;
      return (0, _react2.jsx)("span", {
        css: _styles.wrapperStyle
      }, (0, _react2.jsx)(_Dropdown.default, {
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        scrollableElement: popupsScrollableElement,
        isOpen: isOpen && !pluginState.disabled,
        handleClickOutside: this.hide,
        handleEscapeKeydown: this.hide,
        zIndex: _editorSharedStyles.akEditorMenuZIndex,
        fitWidth: fitWidth,
        trigger: (0, _react2.jsx)(_ToolbarButton.default, {
          buttonId: _ToolbarButton.TOOLBAR_BUTTON.TEXT_COLOR,
          spacing: isReducedSpacing ? 'none' : 'default',
          disabled: disabled || pluginState.disabled,
          selected: isOpen,
          "aria-label": labelTextColor,
          "aria-expanded": isOpen,
          "aria-haspopup": true,
          title: labelTextColor,
          onClick: this.toggleOpen,
          iconBefore: (0, _react2.jsx)("div", {
            css: _styles.triggerWrapperStyles
          }, (0, _react2.jsx)("div", {
            css: _styles2.textColorIconWrapper
          }, (0, _react2.jsx)(_icon.EditorTextColorIcon, null), (0, _react2.jsx)("div", {
            css: [_styles2.textColorIconBar, selectedColor ? "background: ".concat(selectedColor, ";") : pluginState.disabled && _styles2.backgroundDisabled]
          })), (0, _react2.jsx)("span", {
            css: _styles.expandIconWrapperStyle
          }, (0, _react2.jsx)(_chevronDown.default, {
            label: ""
          })))
        })
      }, (0, _react2.jsx)("div", {
        "data-testid": "text-color-palette"
      }, (0, _react2.jsx)(_ColorPalette.default, {
        palette: palette,
        onClick: function onClick(color) {
          return _this2.changeTextColor(color, pluginState.disabled);
        },
        selectedColor: pluginState.color
      }))), (0, _react2.jsx)("span", {
        css: _styles.separatorStyles
      }));
    }
  }, {
    key: "getCommonAnalyticsAttributes",
    value: function getCommonAnalyticsAttributes() {
      return {
        experiment: EXPERIMENT_NAME,
        experimentGroup: EXPERIMENT_GROUP_CONTROL
      };
    }
  }, {
    key: "buildAnalyticsPalette",
    value: function buildAnalyticsPalette(action, data) {
      return {
        action: action,
        actionSubject: _analytics.ACTION_SUBJECT.TOOLBAR,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_COLOR,
        eventType: _analytics.EVENT_TYPE.TRACK,
        attributes: _objectSpread(_objectSpread({}, this.getCommonAnalyticsAttributes()), data)
      };
    }
  }, {
    key: "buildAnalyticsSelectColor",
    value: function buildAnalyticsSelectColor(data) {
      return {
        action: _analytics.ACTION.FORMATTED,
        actionSubject: _analytics.ACTION_SUBJECT.TEXT,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_COLOR,
        eventType: _analytics.EVENT_TYPE.TRACK,
        attributes: _objectSpread(_objectSpread({}, this.getCommonAnalyticsAttributes()), data)
      };
    }
  }, {
    key: "dispatchAnalyticsEvent",
    value: function dispatchAnalyticsEvent(payload) {
      var dispatchAnalyticsEvent = this.props.dispatchAnalyticsEvent;

      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent(payload);
      }
    }
  }]);
  return ToolbarTextColor;
}(_react.default.Component);

exports.ToolbarTextColor = ToolbarTextColor;

var _default = (0, _reactIntlNext.injectIntl)(ToolbarTextColor);

exports.default = _default;