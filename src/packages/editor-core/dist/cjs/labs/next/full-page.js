"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FullPage = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _rafSchd = _interopRequireDefault(require("raf-schd"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _analyticsNext = require("@atlaskit/analytics-next");

var _ui = require("@atlaskit/editor-common/ui");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _ContentStyles = _interopRequireDefault(require("../../ui/ContentStyles"));

var _WidthEmitter = _interopRequireDefault(require("../../ui/WidthEmitter"));

var _Addon = require("../../ui/Addon");

var _styles = require("../../ui/styles");

var _commonStyles = require("@atlaskit/editor-plugin-table/ui/common-styles");

var _ui2 = _interopRequireDefault(require("../../plugins/collab-edit/ui"));

var _Editor = require("./Editor");

var _Toolbar = require("./Toolbar");

var _ContentComponents = require("./ContentComponents");

var _useAnalytics = require("./internal/hooks/use-analytics");

var _context = require("../../ui/ContextPanel/context");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;

var fullPageEditorWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  min-width: 340px;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n"])));
var scrollContainer = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  flex-grow: 1;\n  overflow-y: scroll;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  scroll-behavior: smooth;\n  ", ";\n"])), _styles.scrollbarStyles);
var GUTTER_PADDING = 32;
var GUTTER_STYLE = {
  padding: "0 ".concat(GUTTER_PADDING, "px")
};
var contentArea = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: row;\n  height: 100%;\n  box-sizing: border-box;\n"])));

var editorContentArea = function editorContentArea(theme) {
  return (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  line-height: 24px;\n  height: 100%;\n  width: 100%;\n  max-width: ", "px;\n  padding-top: 50px;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  padding-bottom: 55px;\n\n  & .ProseMirror {\n    flex-grow: 1;\n    box-sizing: border-box;\n  }\n\n  && .ProseMirror {\n    & > * {\n      clear: both;\n    }\n    > p,\n    > ul,\n    > ol,\n    > h1,\n    > h2,\n    > h3,\n    > h4,\n    > h5,\n    > h6 {\n      clear: none;\n    }\n  }\n  ", ";\n"])), theme.layoutMaxWidth + GUTTER_PADDING * 2, _commonStyles.tableFullPageEditorStyles);
};

var mainToolbar = (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n  align-items: center;\n  box-shadow: 'none';\n\n  transition: box-shadow 200ms;\n  z-index: ", ";\n  display: flex;\n  height: 80px;\n  flex-shrink: 0;\n  background-color: ", ";\n\n  & object {\n    height: 0 !important;\n  }\n"])), _editorSharedStyles.akEditorMenuZIndex, (0, _tokens.token)('elevation.surface', 'white'));
var mainToolbarWithKeyline = (0, _react2.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n  box-shadow: 0 ", "px 0 0 ", "\n"])), mainToolbar, _editorSharedStyles.akEditorToolbarKeylineHeight, (0, _tokens.token)('color.border', _colors.N30));
var mainToolbarCustomComponentsSlot = (0, _react2.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  justify-content: flex-end;\n  flex-grow: 1;\n"])));
var sidebarArea = (0, _react2.css)(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2.default)(["\n  height: 100%;\n  box-sizing: border-box;\n"])));

function useKeyline() {
  var _React$useState = _react.default.useState(false),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      showKeyline = _React$useState2[0],
      setShowKeyline = _React$useState2[1];

  var scrollContainerRef = _react.default.useRef(null);

  _react.default.useEffect(function () {
    var current = scrollContainerRef.current;
    var handleScroll = (0, _rafSchd.default)(function () {
      if (!current) {
        return;
      }

      var scrollTop = current.scrollTop;
      setShowKeyline(scrollTop > _editorSharedStyles.akEditorToolbarKeylineHeight);
    });

    if (!current) {
      return;
    }

    window.addEventListener('resize', handleScroll);
    current.addEventListener('scroll', handleScroll);
    handleScroll();
    return function () {
      if (current) {
        current.removeEventListener('scroll', handleScroll);
      }

      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return [showKeyline, scrollContainerRef];
}

function FullPage(props) {
  var primaryToolbarComponents = props.primaryToolbarComponents,
      contentComponents = props.contentComponents,
      collabEdit = props.collabEdit,
      createAnalyticsEvent = props.createAnalyticsEvent,
      contextPanel = props.contextPanel;
  var handleAnalyticsEvent = (0, _useAnalytics.useCreateAnalyticsHandler)(createAnalyticsEvent);

  var _useKeyline = useKeyline(),
      _useKeyline2 = (0, _slicedToArray2.default)(_useKeyline, 2),
      showKeyline = _useKeyline2[0],
      scrollContainerRef = _useKeyline2[1];

  var config = (0, _Editor.useEditorSharedConfig)();

  var wrapperElementRef = /*#__PURE__*/_react.default.createRef();

  return (0, _react2.jsx)(_context.ContextPanelWidthProvider, null, (0, _react2.jsx)(_Editor.Editor, (0, _extends2.default)({}, props, {
    onAnalyticsEvent: handleAnalyticsEvent
  }), (0, _react2.jsx)(_ui.BaseTheme, null, (0, _react2.jsx)("div", {
    css: fullPageEditorWrapper,
    className: "akEditor",
    ref: wrapperElementRef
  }, (0, _react2.jsx)("div", {
    "data-testid": "ak-editor-main-toolbar",
    css: showKeyline ? mainToolbarWithKeyline : mainToolbar
  }, (0, _react2.jsx)(_Toolbar.Toolbar, {
    containerElement: scrollContainerRef.current
  }), (0, _react2.jsx)("div", {
    css: mainToolbarCustomComponentsSlot
  }, !config ? null : (0, _react2.jsx)(_ui2.default, {
    editorView: config.editorView,
    eventDispatcher: config.eventDispatcher,
    inviteToEditHandler: collabEdit === null || collabEdit === void 0 ? void 0 : collabEdit.inviteToEditHandler,
    isInviteToEditButtonSelected: collabEdit === null || collabEdit === void 0 ? void 0 : collabEdit.isInviteToEditButtonSelected
  }), primaryToolbarComponents)), (0, _react2.jsx)("div", {
    css: contentArea
  }, (0, _react2.jsx)(_ContentStyles.default, {
    ref: scrollContainerRef,
    className: "fabric-editor-popup-scroll-parent",
    css: scrollContainer
  }, (0, _react2.jsx)(_Addon.ClickAreaBlock, {
    editorView: config === null || config === void 0 ? void 0 : config.editorView
  }, (0, _react2.jsx)("div", {
    css: editorContentArea
  }, (0, _react2.jsx)("div", {
    style: GUTTER_STYLE,
    className: "ak-editor-content-area"
  }, contentComponents, (0, _react2.jsx)(_Editor.EditorContent, null), (0, _react2.jsx)(_ContentComponents.ContentComponents, {
    wrapperElement: wrapperElementRef.current,
    containerElement: scrollContainerRef.current
  }))))), contextPanel && (0, _react2.jsx)("div", {
    css: sidebarArea
  }, contextPanel), (0, _react2.jsx)(_WidthEmitter.default, {
    editorView: config === null || config === void 0 ? void 0 : config.editorView
  }))))));
}

FullPage.displayName = 'FullPageEditor';
var FullPageWithAnalytics = (0, _analyticsNext.withAnalyticsEvents)()(FullPage);
exports.FullPage = FullPageWithAnalytics;