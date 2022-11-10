"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentEditorWithIntl = void 0;

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

var _buttonGroup = _interopRequireDefault(require("@atlaskit/button/button-group"));

var _customThemeButton = _interopRequireDefault(require("@atlaskit/button/custom-theme-button"));

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _Toolbar = _interopRequireDefault(require("../../Toolbar"));

var _PluginSlot = _interopRequireDefault(require("../../PluginSlot"));

var _WithPluginState = _interopRequireDefault(require("../../WithPluginState"));

var _maxContentSize = require("../../../plugins/max-content-size");

var _pluginKey = require("../../../plugins/media/pm-plugins/plugin-key");

var _Addon = require("../../Addon");

var _commonStyles = require("@atlaskit/editor-plugin-table/ui/common-styles");

var _WithFlash = _interopRequireDefault(require("../../WithFlash"));

var _ui = require("@atlaskit/editor-common/ui");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _WidthEmitter = _interopRequireDefault(require("../../WidthEmitter"));

var _grid = require("../../../plugins/grid");

var _classnames = _interopRequireDefault(require("classnames"));

var _reactIntlNext = require("react-intl-next");

var _messages = _interopRequireDefault(require("../../../messages"));

var _Toolbar2 = require("./Toolbar");

var _ContentStyles = require("../../ContentStyles");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var CommentEditorMargin = 14;
var CommentEditorSmallerMargin = 8;
var commentEditorStyle = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: column;\n\n  .less-margin .ProseMirror {\n    margin: 12px ", "px ", "px;\n  }\n\n  min-width: 272px;\n  /* Border + Toolbar + Footer + (Paragraph + ((Paragraph + Margin) * (DefaultLines - 1)) */\n  /* calc(2px + 40px + 24px + ( 20px + (32px * 2))) */\n\n  height: auto;\n  background-color: ", ";\n  border: 1px solid ", ";\n  box-sizing: border-box;\n  border-radius: ", "px;\n\n  max-width: inherit;\n  word-wrap: break-word;\n"])), CommentEditorSmallerMargin, CommentEditorSmallerMargin, (0, _tokens.token)('color.background.input', 'white'), (0, _tokens.token)('color.border', _colors.N40), (0, _constants.borderRadius)());
var ContentArea = (0, _ContentStyles.createEditorContentStyle)((0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  flex-grow: 1;\n  overflow-x: hidden;\n  overflow-y: auto;\n  line-height: 24px;\n\n  /** Hack for Bitbucket to ensure entire editorView gets drop event; see ED-3294 **/\n  /** Hack for table controls. Otherwise margin collapse and controls are misplaced. **/\n  .ProseMirror {\n    margin: 12px ", "px ", "px;\n  }\n\n  .gridParent {\n    margin-left: ", "px;\n    margin-right: ", "px;\n    width: calc(100% + ", "px);\n  }\n\n  padding: ", "px;\n\n  ", ";\n"])), CommentEditorMargin, CommentEditorMargin, CommentEditorMargin - _grid.GRID_GUTTER, CommentEditorMargin - _grid.GRID_GUTTER, CommentEditorMargin - _grid.GRID_GUTTER, _Toolbar2.TableControlsPadding, _commonStyles.tableCommentEditorStyles));
ContentArea.displayName = 'ContentArea';
var secondaryToolbarStyle = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  box-sizing: border-box;\n  justify-content: flex-end;\n  align-items: center;\n  display: flex;\n  padding: 12px 1px;\n"])));

var Editor = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(Editor, _React$Component);

  var _super = _createSuper(Editor);

  // Wrapper container for toolbar and content area
  function Editor(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Editor);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "appearance", 'comment');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "containerElement", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "wrapperElementRef", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSave", function () {
      if (_this.props.editorView && _this.props.onSave) {
        _this.props.onSave(_this.props.editorView);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleCancel", function () {
      if (_this.props.editorView && _this.props.onCancel) {
        _this.props.onCancel(_this.props.editorView);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderChrome", function (_ref) {
      var maxContentSize = _ref.maxContentSize,
          mediaState = _ref.mediaState;
      var _this$props = _this.props,
          editorDOMElement = _this$props.editorDOMElement,
          editorView = _this$props.editorView,
          editorActions = _this$props.editorActions,
          eventDispatcher = _this$props.eventDispatcher,
          providerFactory = _this$props.providerFactory,
          contentComponents = _this$props.contentComponents,
          customContentComponents = _this$props.customContentComponents,
          customPrimaryToolbarComponents = _this$props.customPrimaryToolbarComponents,
          primaryToolbarComponents = _this$props.primaryToolbarComponents,
          customSecondaryToolbarComponents = _this$props.customSecondaryToolbarComponents,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          maxHeight = _this$props.maxHeight,
          _this$props$minHeight = _this$props.minHeight,
          minHeight = _this$props$minHeight === void 0 ? 150 : _this$props$minHeight,
          onSave = _this$props.onSave,
          onCancel = _this$props.onCancel,
          disabled = _this$props.disabled,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent,
          intl = _this$props.intl,
          useStickyToolbar = _this$props.useStickyToolbar;
      var maxContentSizeReached = Boolean(maxContentSize === null || maxContentSize === void 0 ? void 0 : maxContentSize.maxContentSizeReached);
      var showSecondaryToolbar = !!onSave || !!onCancel || !!customSecondaryToolbarComponents;
      return (0, _react2.jsx)(_WithFlash.default, {
        animate: maxContentSizeReached
      }, (0, _react2.jsx)("div", {
        css: [commentEditorStyle, (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n              min-height: ", "px;\n            "])), minHeight)],
        className: "akEditor",
        ref: _this.wrapperElementRef
      }, (0, _react2.jsx)(_Toolbar2.MainToolbar, {
        useStickyToolbar: useStickyToolbar
      }, (0, _react2.jsx)(_Toolbar.default, {
        editorView: editorView,
        editorActions: editorActions,
        eventDispatcher: eventDispatcher,
        providerFactory: providerFactory,
        appearance: _this.appearance,
        items: primaryToolbarComponents,
        popupsMountPoint: popupsMountPoint,
        popupsBoundariesElement: popupsBoundariesElement,
        popupsScrollableElement: popupsScrollableElement,
        disabled: !!disabled,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        containerElement: _this.containerElement
      }), (0, _react2.jsx)("div", {
        css: _Toolbar2.mainToolbarCustomComponentsSlotStyle
      }, customPrimaryToolbarComponents)), (0, _react2.jsx)(_Addon.ClickAreaBlock, {
        editorView: editorView,
        editorDisabled: disabled
      }, (0, _react2.jsx)(_ui.WidthConsumer, null, function (_ref2) {
        var width = _ref2.width;
        return (0, _react2.jsx)(ContentArea, {
          ref: function ref(_ref3) {
            return _this.containerElement = _ref3;
          },
          css: maxHeight ? (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n                            max-height: ", "px;\n                          "])), maxHeight) : null,
          className: (0, _classnames.default)('ak-editor-content-area', {
            'less-margin': width < _editorSharedStyles.akEditorMobileBreakoutPoint
          })
        }, customContentComponents, (0, _react2.jsx)(_PluginSlot.default, {
          editorView: editorView,
          editorActions: editorActions,
          eventDispatcher: eventDispatcher,
          dispatchAnalyticsEvent: dispatchAnalyticsEvent,
          providerFactory: providerFactory,
          appearance: _this.appearance,
          items: contentComponents,
          popupsMountPoint: popupsMountPoint,
          popupsBoundariesElement: popupsBoundariesElement,
          popupsScrollableElement: popupsScrollableElement,
          containerElement: _this.containerElement,
          disabled: !!disabled,
          wrapperElement: _this.wrapperElementRef.current
        }), editorDOMElement);
      })), (0, _react2.jsx)(_WidthEmitter.default, {
        editorView: editorView
      })), showSecondaryToolbar && (0, _react2.jsx)("div", {
        css: secondaryToolbarStyle,
        "data-testid": "ak-editor-secondary-toolbar"
      }, (0, _react2.jsx)(_buttonGroup.default, null, !!onSave && (0, _react2.jsx)(_customThemeButton.default, {
        appearance: "primary",
        onClick: _this.handleSave,
        testId: "comment-save-button",
        isDisabled: disabled || mediaState && !mediaState.allUploadsFinished
      }, intl.formatMessage(_messages.default.saveButton)), !!onCancel && (0, _react2.jsx)(_customThemeButton.default, {
        appearance: "subtle",
        onClick: _this.handleCancel,
        isDisabled: disabled
      }, intl.formatMessage(_messages.default.cancelButton))), (0, _react2.jsx)("span", {
        style: {
          flexGrow: 1
        }
      }), customSecondaryToolbarComponents));
    });

    if (props.innerRef) {
      _this.wrapperElementRef = props.innerRef;
    }

    return _this;
  }

  (0, _createClass2.default)(Editor, [{
    key: "render",
    value: function render() {
      return (0, _react2.jsx)(_WithPluginState.default, {
        plugins: {
          maxContentSize: _maxContentSize.pluginKey,
          mediaState: _pluginKey.stateKey
        },
        render: this.renderChrome
      });
    }
  }]);
  return Editor;
}(_react.default.Component);

(0, _defineProperty2.default)(Editor, "displayName", 'CommentEditorAppearance');
var CommentEditorWithIntl = (0, _reactIntlNext.injectIntl)(Editor);
exports.CommentEditorWithIntl = CommentEditorWithIntl;