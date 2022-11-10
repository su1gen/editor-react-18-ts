"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FullPageToolbar = exports.EditorToolbar = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _ui = _interopRequireDefault(require("../../../plugins/collab-edit/ui"));

var _FindReplaceToolbarButtonWithState = _interopRequireDefault(require("../../../plugins/find-replace/FindReplaceToolbarButtonWithState"));

var _BeforePrimaryToolbarWrapper = require("../../../plugins/before-primaryToolbar/ui/BeforePrimaryToolbarWrapper");

var _Toolbar = _interopRequireDefault(require("../../Toolbar"));

var _MainToolbar = require("./MainToolbar");

var _context = require("../../ContextPanel/context");

var _messages = _interopRequireDefault(require("./messages"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @jsx jsx */
var EditorToolbar = /*#__PURE__*/_react.default.memo(function (props) {
  var _props$featureFlags, _props$featureFlags2, _props$featureFlags3, _props$featureFlags4, _props$collabEdit, _props$collabEdit2, _props$collabEdit3, _props$featureFlags5, _props$featureFlags6;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      shouldSplitToolbar = _useState2[0],
      setShouldSplitToolbar = _useState2[1];

  var nonCustomToolbar = (0, _react2.jsx)("div", {
    css: _MainToolbar.nonCustomToolbarWrapperStyle
  }, props.beforeIcon && (0, _react2.jsx)("div", {
    css: _MainToolbar.mainToolbarIconBeforeStyle
  }, props.beforeIcon), (0, _react2.jsx)(_Toolbar.default, {
    editorView: props.editorView,
    editorActions: props.editorActions,
    eventDispatcher: props.eventDispatcher,
    providerFactory: props.providerFactory,
    appearance: props.appearance,
    items: props.primaryToolbarComponents,
    popupsMountPoint: props.popupsMountPoint,
    popupsBoundariesElement: props.popupsBoundariesElement,
    popupsScrollableElement: props.popupsScrollableElement,
    disabled: props.disabled,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
    containerElement: props.containerElement,
    hasMinWidth: props.hasMinWidth,
    twoLineEditorToolbar: !!((_props$featureFlags = props.featureFlags) !== null && _props$featureFlags !== void 0 && _props$featureFlags.twoLineEditorToolbar)
  }));
  var customToolbar = (0, _react2.jsx)("div", {
    css: _MainToolbar.customToolbarWrapperStyle
  }, (_props$featureFlags2 = props.featureFlags) !== null && _props$featureFlags2 !== void 0 && _props$featureFlags2.twoLineEditorToolbar && !!props.customPrimaryToolbarComponents && 'before' in props.customPrimaryToolbarComponents ? (0, _react2.jsx)(_BeforePrimaryToolbarWrapper.BeforePrimaryToolbarWrapper, {
    beforePrimaryToolbarComponents: props.customPrimaryToolbarComponents.before
  }) : null, (props === null || props === void 0 ? void 0 : (_props$featureFlags3 = props.featureFlags) === null || _props$featureFlags3 === void 0 ? void 0 : _props$featureFlags3.showAvatarGroupAsPlugin) === true && !((_props$featureFlags4 = props.featureFlags) !== null && _props$featureFlags4 !== void 0 && _props$featureFlags4.twoLineEditorToolbar) ? null : (0, _react2.jsx)(_ui.default, {
    editorView: props.editorView,
    eventDispatcher: props.eventDispatcher,
    inviteToEditComponent: (_props$collabEdit = props.collabEdit) === null || _props$collabEdit === void 0 ? void 0 : _props$collabEdit.inviteToEditComponent,
    inviteToEditHandler: (_props$collabEdit2 = props.collabEdit) === null || _props$collabEdit2 === void 0 ? void 0 : _props$collabEdit2.inviteToEditHandler,
    isInviteToEditButtonSelected: (_props$collabEdit3 = props.collabEdit) === null || _props$collabEdit3 === void 0 ? void 0 : _props$collabEdit3.isInviteToEditButtonSelected
  }), (_props$featureFlags5 = props.featureFlags) !== null && _props$featureFlags5 !== void 0 && _props$featureFlags5.findReplace && (_props$featureFlags6 = props.featureFlags) !== null && _props$featureFlags6 !== void 0 && _props$featureFlags6.twoLineEditorToolbar ? (0, _react2.jsx)(_FindReplaceToolbarButtonWithState.default, {
    popupsBoundariesElement: props.popupsBoundariesElement,
    popupsMountPoint: props.popupsMountPoint,
    popupsScrollableElement: props.popupsScrollableElement,
    editorView: props.editorView,
    containerElement: props.containerElement,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent
  }) : null, !!props.customPrimaryToolbarComponents && 'after' in props.customPrimaryToolbarComponents ? props.customPrimaryToolbarComponents.after : props.customPrimaryToolbarComponents);
  (0, _react.useEffect)(function () {
    var _props$featureFlags7;

    if ((_props$featureFlags7 = props.featureFlags) !== null && _props$featureFlags7 !== void 0 && _props$featureFlags7.twoLineEditorToolbar) {
      var updateOnResize = function updateOnResize() {
        setShouldSplitToolbar(window.innerWidth <= _MainToolbar.MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT);
      };

      window.addEventListener('resize', updateOnResize);
      updateOnResize();
      return function () {
        return window.removeEventListener('resize', updateOnResize);
      };
    }
  });
  return (0, _react2.jsx)(_context.ContextPanelConsumer, null, function (_ref) {
    var _props$featureFlags8, _props$featureFlags9, _props$featureFlags10;

    var contextPanelWidth = _ref.width;
    return (0, _react2.jsx)("div", {
      css: (0, _MainToolbar.mainToolbarStyle)(props.showKeyline || contextPanelWidth > 0, !!((_props$featureFlags8 = props.featureFlags) !== null && _props$featureFlags8 !== void 0 && _props$featureFlags8.twoLineEditorToolbar)),
      "data-testid": "ak-editor-main-toolbar"
    }, (0, _react2.jsx)("div", {
      css: (0, _MainToolbar.mainToolbarFirstChildStyle)(!!((_props$featureFlags9 = props.featureFlags) !== null && _props$featureFlags9 !== void 0 && _props$featureFlags9.twoLineEditorToolbar)),
      role: "toolbar",
      "aria-label": props.intl.formatMessage(_messages.default.toolbarLabel)
    }, shouldSplitToolbar ? customToolbar : nonCustomToolbar), (0, _react2.jsx)("div", {
      css: (0, _MainToolbar.mainToolbarSecondChildStyle)(!!((_props$featureFlags10 = props.featureFlags) !== null && _props$featureFlags10 !== void 0 && _props$featureFlags10.twoLineEditorToolbar)),
      "data-testid": 'avatar-group-outside-plugin',
      role: "region",
      "aria-label": props.intl.formatMessage(_messages.default.pageActionsLabel)
    }, shouldSplitToolbar ? nonCustomToolbar : customToolbar));
  });
});

exports.EditorToolbar = EditorToolbar;
var FullPageToolbar = (0, _reactIntlNext.injectIntl)(EditorToolbar);
exports.FullPageToolbar = FullPageToolbar;