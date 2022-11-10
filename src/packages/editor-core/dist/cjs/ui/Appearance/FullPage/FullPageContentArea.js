"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FullPageContentArea = exports.CONTENT_AREA_TEST_ID = void 0;

var _react = require("@emotion/react");

var _ui = require("@atlaskit/editor-common/ui");

var _context = require("../../ContextPanel/context");

var _react2 = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _Addon = require("../../Addon");

var _ContextPanel = _interopRequireDefault(require("../../ContextPanel"));

var _PluginSlot = _interopRequireDefault(require("../../PluginSlot"));

var _WidthEmitter = _interopRequireDefault(require("../../WidthEmitter"));

var _StyledComponents = require("./StyledComponents");

var _messages = _interopRequireDefault(require("./messages"));

/** @jsx jsx */
var CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';
exports.CONTENT_AREA_TEST_ID = CONTENT_AREA_TEST_ID;

var Content = /*#__PURE__*/_react2.default.memo(function (props) {
  var theme = (0, _react.useTheme)();
  var fullWidthMode = props.appearance === 'full-width';
  return (0, _react.jsx)(_ui.WidthConsumer, null, function (_ref) {
    var width = _ref.width;
    return (0, _react.jsx)(_context.ContextPanelConsumer, null, function (_ref2) {
      var positionedOverEditor = _ref2.positionedOverEditor;
      return (0, _react.jsx)("div", {
        css: [_StyledComponents.contentArea, positionedOverEditor && _StyledComponents.positionedOverEditorStyle],
        "data-testid": CONTENT_AREA_TEST_ID
      }, (0, _react.jsx)(_StyledComponents.ScrollContainer, {
        ref: props.scrollContainerRef,
        className: "fabric-editor-popup-scroll-parent"
      }, (0, _react.jsx)(_Addon.ClickAreaBlock, {
        editorView: props.editorView,
        editorDisabled: props.disabled
      }, (0, _react.jsx)("div", {
        css: (0, _StyledComponents.editorContentAreaStyle)({
          fullWidthMode: fullWidthMode,
          layoutMaxWidth: theme.layoutMaxWidth,
          containerWidth: width
        }),
        role: "region",
        "aria-label": props.intl.formatMessage(_messages.default.editableContentLabel),
        ref: props.contentAreaRef
      }, (0, _react.jsx)("div", {
        css: _StyledComponents.editorContentGutterStyle,
        className: ['ak-editor-content-area', fullWidthMode ? 'fabric-editor--full-width-mode' : ''].join(' ')
      }, props.customContentComponents, (0, _react.jsx)(_PluginSlot.default, {
        editorView: props.editorView,
        editorActions: props.editorActions,
        eventDispatcher: props.eventDispatcher,
        providerFactory: props.providerFactory,
        appearance: props.appearance,
        items: props.contentComponents,
        contentArea: props.contentArea,
        popupsMountPoint: props.popupsMountPoint,
        popupsBoundariesElement: props.popupsBoundariesElement,
        popupsScrollableElement: props.popupsScrollableElement,
        disabled: !!props.disabled,
        containerElement: props.scrollContainer,
        dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
        wrapperElement: props.wrapperElement
      }), props.editorDOMElement)))), (0, _react.jsx)("div", {
        css: _StyledComponents.sidebarArea
      }, props.contextPanel || (0, _react.jsx)(_ContextPanel.default, {
        visible: false
      })), (0, _react.jsx)(_WidthEmitter.default, {
        editorView: props.editorView
      }));
    });
  });
});

var FullPageContentArea = (0, _reactIntlNext.injectIntl)(Content);
exports.FullPageContentArea = FullPageContentArea;