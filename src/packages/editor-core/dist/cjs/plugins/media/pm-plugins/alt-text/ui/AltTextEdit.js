"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MAX_ALT_TEXT_LENGTH = exports.CONTAINER_WIDTH_IN_PX = exports.AltTextEditComponent = void 0;

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

var _chevronLeftLarge = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-left-large"));

var _crossCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/cross-circle"));

var _messages = require("../messages");

var _reactIntlNext = require("react-intl-next");

var _Button = _interopRequireDefault(require("../../../../floating-toolbar/ui/Button"));

var _PanelTextInput = _interopRequireDefault(require("../../../../../ui/PanelTextInput"));

var keymaps = _interopRequireWildcard(require("../../../../../keymaps"));

var _commands = require("../commands");

var _analyticsNext = require("@atlaskit/analytics-next");

var _analytics = require("../../../../analytics");

var _ToolbarComponents = require("../../../../../ui/LinkSearch/ToolbarComponents");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _ui = require("@atlaskit/editor-common/ui");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var CONTAINER_WIDTH_IN_PX = _ToolbarComponents.RECENT_SEARCH_WIDTH_IN_PX;
exports.CONTAINER_WIDTH_IN_PX = CONTAINER_WIDTH_IN_PX;
var MAX_ALT_TEXT_LENGTH = 510; // double tweet length

exports.MAX_ALT_TEXT_LENGTH = MAX_ALT_TEXT_LENGTH;
var supportText = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n  font-size: ", ";\n  padding: 12px 40px;\n  line-height: 20px;\n  border-top: 1px solid ", ";\n  margin: 0;\n"])), (0, _tokens.token)('color.text.subtlest', _colors.N100), (0, _editorSharedStyles.relativeFontSizeToBase16)(12), (0, _tokens.token)('color.border', _colors.N30));
var container = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  width: ", "px;\n  display: flex;\n  flex-direction: column;\n  overflow: auto;\n  line-height: 2;\n"])), CONTAINER_WIDTH_IN_PX);
var inputWrapper = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  line-height: 0;\n  padding: 5px 0;\n  align-items: center;\n"])));
var validationWrapper = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  line-height: 0;\n  padding: 12px 24px 12px 0;\n  margin: 0 12px 0 40px;\n  border-top: 1px solid ", ";\n  align-items: start;\n  flex-direction: column;\n"])), (0, _tokens.token)('color.border.danger', _colors.R400));
var buttonWrapper = (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  padding: 4px 8px;\n"])));
var clearText = (0, _react2.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n"])), (0, _tokens.token)('color.icon.subtle', _colors.N80));

var AltTextEditComponent = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(AltTextEditComponent, _React$Component);

  var _super = _createSuper(AltTextEditComponent);

  function AltTextEditComponent(props) {
    var _this;

    (0, _classCallCheck2.default)(this, AltTextEditComponent);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      showClearTextButton: Boolean(_this.props.value),
      validationErrors: _this.props.value ? _this.getValidationErrors(_this.props.value) : [],
      lastValue: _this.props.value
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "closeMediaAltTextMenu", function () {
      var view = _this.props.view;
      (0, _commands.closeMediaAltTextMenu)(view.state, view.dispatch);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "dispatchCancelEvent", function (event) {
      var view = _this.props.view; // We need to pass down the ESCAPE keymap
      // because when we focus on the Toolbar, Prosemirror blur,
      // making all keyboard shortcuts not working

      view.someProp('handleKeyDown', function (fn) {
        return fn(view, event);
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateAltText", function (newAltText) {
      var view = _this.props.view;
      var newValue = newAltText.length === 0 ? '' : newAltText;
      (0, _commands.updateAltText)(newValue)(view.state, view.dispatch);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOnChange", function (newAltText) {
      var validationErrors = _this.getValidationErrors(newAltText);

      _this.setState({
        showClearTextButton: Boolean(newAltText),
        validationErrors: validationErrors,
        lastValue: newAltText
      }, function () {
        if (!validationErrors || !validationErrors.length) {
          _this.updateAltText(newAltText);
        }
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOnBlur", function () {
      // Handling the trimming onBlur() because PanelTextInput doesn't sync
      // defaultValue properly during unmount
      var value = _this.props.value;
      var newValue = (_this.state.lastValue || value || '').trim();

      _this.handleOnChange(newValue);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClearText", function () {
      _this.handleOnChange('');
    });
    var createAnalyticsEvent = props.createAnalyticsEvent;
    _this.fireCustomAnalytics = (0, _analytics.fireAnalyticsEvent)(createAnalyticsEvent);
    return _this;
  }

  (0, _createClass2.default)(AltTextEditComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.prevValue = this.props.value;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.fireAnalytics(_analytics.ACTION.CLOSED);

      if (!this.prevValue && this.props.value) {
        this.fireAnalytics(_analytics.ACTION.ADDED);
      }

      if (this.prevValue && !this.props.value) {
        this.fireAnalytics(_analytics.ACTION.CLEARED);
      }

      if (this.prevValue && this.prevValue !== this.props.value) {
        this.fireAnalytics(_analytics.ACTION.EDITED);
      }
    }
  }, {
    key: "getValidationErrors",
    value: function getValidationErrors(value) {
      var altTextValidator = this.props.altTextValidator;

      if (value && typeof altTextValidator === 'function') {
        return altTextValidator(value) || [];
      }

      return [];
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var showClearTextButton = this.state.showClearTextButton;
      var backButtonMessage = formatMessage(_messages.messages.back);
      var backButtonMessageComponent = (0, _react2.jsx)(keymaps.ToolTipContent, {
        description: backButtonMessage,
        keymap: keymaps.escape,
        shortcutOverride: "Esc"
      });
      var errorsList = (this.state.validationErrors || []).map(function (error, index) {
        return (0, _react2.jsx)(_ui.ErrorMessage, {
          key: index
        }, error);
      });
      return (0, _react2.jsx)("div", {
        css: container
      }, (0, _react2.jsx)("section", {
        css: inputWrapper
      }, (0, _react2.jsx)("div", {
        css: buttonWrapper
      }, (0, _react2.jsx)(_Button.default, {
        title: formatMessage(_messages.messages.back),
        icon: (0, _react2.jsx)(_chevronLeftLarge.default, {
          label: formatMessage(_messages.messages.back)
        }),
        tooltipContent: backButtonMessageComponent,
        onClick: this.closeMediaAltTextMenu
      })), (0, _react2.jsx)(_PanelTextInput.default, {
        testId: "alt-text-input",
        ariaLabel: formatMessage(_messages.messages.placeholder),
        describedById: "support-text",
        placeholder: formatMessage(_messages.messages.placeholder),
        defaultValue: this.state.lastValue,
        onCancel: this.dispatchCancelEvent,
        onChange: this.handleOnChange,
        onBlur: this.handleOnBlur,
        onSubmit: this.closeMediaAltTextMenu,
        maxLength: MAX_ALT_TEXT_LENGTH,
        autoFocus: true
      }), showClearTextButton && (0, _react2.jsx)("div", {
        css: buttonWrapper
      }, (0, _react2.jsx)(_Button.default, {
        testId: "alt-text-clear-button",
        title: formatMessage(_messages.messages.clear),
        icon: (0, _react2.jsx)("span", {
          css: clearText
        }, (0, _react2.jsx)(_crossCircle.default, {
          label: formatMessage(_messages.messages.clear)
        })),
        tooltipContent: formatMessage(_messages.messages.clear),
        onClick: this.handleClearText
      }))), !!errorsList.length && (0, _react2.jsx)("section", {
        css: validationWrapper
      }, errorsList), (0, _react2.jsx)("p", {
        css: supportText,
        id: "support-text"
      }, formatMessage(_messages.messages.supportText)));
    }
  }, {
    key: "fireAnalytics",
    value: function fireAnalytics(actionType) {
      var createAnalyticsEvent = this.props.createAnalyticsEvent;

      if (createAnalyticsEvent && this.fireCustomAnalytics) {
        this.fireCustomAnalytics({
          payload: {
            action: actionType,
            actionSubject: _analytics.ACTION_SUBJECT.MEDIA,
            actionSubjectId: _analytics.ACTION_SUBJECT_ID.ALT_TEXT,
            eventType: _analytics.EVENT_TYPE.TRACK
          }
        });
      }
    }
  }]);
  return AltTextEditComponent;
}(_react.default.Component);

exports.AltTextEditComponent = AltTextEditComponent;

var _default = (0, _analyticsNext.withAnalyticsEvents)()((0, _reactIntlNext.injectIntl)(AltTextEditComponent));

exports.default = _default;