"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LinkAddToolbar = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _ui = require("@atlaskit/editor-common/ui");

var _chevronLeftLarge = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-left-large"));

var _unlink = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/unlink"));

var _PanelTextInput = _interopRequireDefault(require("../../../ui/PanelTextInput"));

var _Button = _interopRequireDefault(require("../../floating-toolbar/ui/Button"));

var _Separator = _interopRequireDefault(require("../../floating-toolbar/ui/Separator"));

var _ToolbarComponents = require("../../../ui/LinkSearch/ToolbarComponents");

var _LinkSearch = _interopRequireDefault(require("../../../ui/LinkSearch"));

var _messages = require("../../../messages");

var _utils = require("../../hyperlink/utils");

var _colors = require("@atlaskit/theme/colors");

var _enums = require("../../analytics/types/enums");

var _mediaLinkingToolbarMessages = require("./media-linking-toolbar-messages");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var validationWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  line-height: 0;\n  padding: 12px 24px 12px 0;\n  margin: 0 4px 0 32px;\n  border-top: 1px solid ", ";\n  align-items: start;\n  display: flex;\n  flex-direction: column;\n"])), (0, _tokens.token)('color.border.danger', _colors.R400));
var buttonWrapper = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  padding: 4px 8px 4px 0px;\n"])));

var LinkAddToolbar = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(LinkAddToolbar, _React$PureComponent);

  var _super = _createSuper(LinkAddToolbar);

  function LinkAddToolbar() {
    var _this;

    (0, _classCallCheck2.default)(this, LinkAddToolbar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      validationErrors: []
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSubmit", function (_ref) {
      var url = _ref.url,
          inputMethod = _ref.inputMethod;

      _this.props.onSubmit(url, {
        inputMethod: inputMethod
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOnBack", function (_ref2) {
      var url = _ref2.url,
          inputMethod = _ref2.inputMethod;
      var onBack = _this.props.onBack;

      if (onBack) {
        onBack(url, {
          inputMethod: inputMethod
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleCancel", function () {
      var onCancel = _this.props.onCancel;

      if (onCancel) {
        onCancel();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleUnlink", function () {
      var onUnlink = _this.props.onUnlink;

      if (onUnlink) {
        onUnlink();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOnBlur", function (options) {
      _this.props.onBlur(options.url);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderContainer", function (_ref3) {
      var activityProvider = _ref3.activityProvider,
          _ref3$inputProps = _ref3.inputProps,
          _onChange = _ref3$inputProps.onChange,
          onKeyDown = _ref3$inputProps.onKeyDown,
          _onSubmit = _ref3$inputProps.onSubmit,
          value = _ref3$inputProps.value,
          currentInputMethod = _ref3.currentInputMethod,
          renderRecentList = _ref3.renderRecentList;
      var _this$props = _this.props,
          formatMessage = _this$props.intl.formatMessage,
          displayUrl = _this$props.displayUrl;

      var getPlaceholder = function getPlaceholder(hasActivityProvider) {
        return formatMessage(hasActivityProvider ? _messages.linkToolbarMessages.placeholder : _messages.linkToolbarMessages.linkPlaceholder);
      };

      var formatLinkAddressText = formatMessage(_mediaLinkingToolbarMessages.mediaLinkToolbarMessages.backLink);
      var formatUnlinkText = formatMessage(_messages.linkToolbarMessages.unlink);

      var errorsList = _this.state.validationErrors.map(function (error, index) {
        return (0, _react2.jsx)(_ui.ErrorMessage, {
          key: index
        }, error);
      });

      return (0, _react2.jsx)("div", {
        className: "recent-list"
      }, (0, _react2.jsx)("div", {
        css: [_ToolbarComponents.container, !!activityProvider && _ToolbarComponents.containerWithProvider]
      }, (0, _react2.jsx)("div", {
        css: _ToolbarComponents.inputWrapper
      }, (0, _react2.jsx)("span", {
        css: buttonWrapper
      }, (0, _react2.jsx)(_Button.default, {
        title: formatLinkAddressText,
        icon: (0, _react2.jsx)(_chevronLeftLarge.default, {
          label: formatLinkAddressText
        }),
        onClick: function onClick() {
          return _this.handleOnBack({
            url: value,
            inputMethod: currentInputMethod
          });
        }
      })), (0, _react2.jsx)(_PanelTextInput.default, {
        testId: "media-link-input",
        placeholder: getPlaceholder(!!activityProvider),
        autoFocus: true,
        onCancel: _this.handleCancel,
        defaultValue: value,
        onSubmit: function onSubmit(inputValue) {
          var validationErrors = _this.getValidationErrors(inputValue, currentInputMethod);

          _this.setState({
            validationErrors: validationErrors
          });

          if (!validationErrors.length) {
            _onSubmit();
          }
        },
        onChange: function onChange(value) {
          _this.setState({
            validationErrors: []
          });

          _onChange(value);
        },
        onKeyDown: onKeyDown
      }), (0, _utils.normalizeUrl)(displayUrl) && (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(_Separator.default, null), (0, _react2.jsx)(_Button.default, {
        title: formatUnlinkText,
        icon: (0, _react2.jsx)(_unlink.default, {
          label: formatUnlinkText
        }),
        onClick: _this.handleUnlink
      }))), !!errorsList.length && (0, _react2.jsx)("section", {
        css: validationWrapper
      }, errorsList), renderRecentList()));
    });
    return _this;
  }

  (0, _createClass2.default)(LinkAddToolbar, [{
    key: "getValidationErrors",
    value: function getValidationErrors(value, inputMethod) {
      var formatMessage = this.props.intl.formatMessage; // dont show validation errors if input method is typeahed, which means user selects from search list

      if (inputMethod === _enums.INPUT_METHOD.TYPEAHEAD) {
        return [];
      }

      if (!value) {
        return [formatMessage(_messages.linkToolbarMessages.emptyLink)];
      } // if url can be normalized - we consider it is a valid url
      // also don't show validaition errors for empty values


      if ((0, _utils.normalizeUrl)(value)) {
        return [];
      } else {
        return [formatMessage(_messages.linkToolbarMessages.invalidLink)];
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          providerFactory = _this$props2.providerFactory,
          displayUrl = _this$props2.displayUrl;
      return (0, _react2.jsx)(_LinkSearch.default, {
        defaultUrl: (0, _utils.normalizeUrl)(displayUrl),
        providerFactory: providerFactory,
        onSubmit: this.handleSubmit,
        onBlur: this.handleOnBlur,
        render: this.renderContainer
      });
    }
  }]);
  return LinkAddToolbar;
}(_react.default.PureComponent);

exports.LinkAddToolbar = LinkAddToolbar;
var _default = LinkAddToolbar;
exports.default = _default;