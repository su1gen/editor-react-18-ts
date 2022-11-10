"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _types = require("./types");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _commandsWithAnalytics = require("./commands-with-analytics");

var _commands = require("./commands");

var _FindReplaceToolbarButton = _interopRequireDefault(require("./ui/FindReplaceToolbarButton"));

var _analytics = require("../analytics");

var _featureFlagsContext = require("../feature-flags-context");

var FindReplaceToolbarButtonWithState = function FindReplaceToolbarButtonWithState(props) {
  var popupsBoundariesElement = props.popupsBoundariesElement,
      popupsMountPoint = props.popupsMountPoint,
      popupsScrollableElement = props.popupsScrollableElement,
      isToolbarReducedSpacing = props.isToolbarReducedSpacing,
      editorView = props.editorView,
      containerElement = props.containerElement,
      dispatchAnalyticsEvent = props.dispatchAnalyticsEvent;

  if (!editorView) {
    return null;
  } // we need the editor to be in focus for scrollIntoView() to work
  // so we focus it while we run the command, then put focus back into
  // whatever element was previously focused in find replace component


  var runWithEditorFocused = function runWithEditorFocused(fn) {
    var activeElement = document.activeElement;
    editorView.focus();
    fn();
    activeElement === null || activeElement === void 0 ? void 0 : activeElement.focus();
  };

  var dispatchCommand = function dispatchCommand(cmd) {
    var state = editorView.state,
        dispatch = editorView.dispatch;
    cmd(state, dispatch);
  };

  var handleActivate = function handleActivate() {
    runWithEditorFocused(function () {
      return dispatchCommand((0, _commandsWithAnalytics.activateWithAnalytics)({
        triggerMethod: _analytics.TRIGGER_METHOD.TOOLBAR
      }));
    });
  };

  var handleFind = function handleFind(keyword) {
    runWithEditorFocused(function () {
      return dispatchCommand((0, _commandsWithAnalytics.findWithAnalytics)({
        editorView: editorView,
        containerElement: containerElement,
        keyword: keyword
      }));
    });
  };

  var handleFindNext = function handleFindNext(_ref) {
    var triggerMethod = _ref.triggerMethod;
    runWithEditorFocused(function () {
      return dispatchCommand((0, _commandsWithAnalytics.findNextWithAnalytics)({
        triggerMethod: triggerMethod
      }));
    });
  };

  var handleFindPrev = function handleFindPrev(_ref2) {
    var triggerMethod = _ref2.triggerMethod;
    runWithEditorFocused(function () {
      return dispatchCommand((0, _commandsWithAnalytics.findPrevWithAnalytics)({
        triggerMethod: triggerMethod
      }));
    });
  };

  var handleReplace = function handleReplace(_ref3) {
    var triggerMethod = _ref3.triggerMethod,
        replaceText = _ref3.replaceText;
    runWithEditorFocused(function () {
      return dispatchCommand((0, _commandsWithAnalytics.replaceWithAnalytics)({
        triggerMethod: triggerMethod,
        replaceText: replaceText
      }));
    });
  };

  var handleReplaceAll = function handleReplaceAll(_ref4) {
    var replaceText = _ref4.replaceText;
    runWithEditorFocused(function () {
      return dispatchCommand((0, _commandsWithAnalytics.replaceAllWithAnalytics)({
        replaceText: replaceText
      }));
    });
  };

  var handleFindBlur = function handleFindBlur() {
    dispatchCommand((0, _commands.blur)());
  };

  var handleCancel = function handleCancel(_ref5) {
    var triggerMethod = _ref5.triggerMethod;
    dispatchCommand((0, _commandsWithAnalytics.cancelSearchWithAnalytics)({
      triggerMethod: triggerMethod
    }));
    editorView.focus();
  };

  var handleToggleMatchCase = function handleToggleMatchCase() {
    dispatchCommand((0, _commands.toggleMatchCase)());
  };

  var _getFeatureFlags = (0, _featureFlagsContext.getFeatureFlags)(editorView.state),
      findReplaceMatchCase = _getFeatureFlags.findReplaceMatchCase;

  return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
    debounce: false,
    plugins: {
      findReplaceState: _types.findReplacePluginKey
    },
    render: function render(_ref6) {
      var findReplaceState = _ref6.findReplaceState;

      if (!findReplaceState) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_FindReplaceToolbarButton.default, {
        allowMatchCase: findReplaceMatchCase,
        shouldMatchCase: findReplaceState.shouldMatchCase,
        onToggleMatchCase: handleToggleMatchCase,
        isActive: findReplaceState.isActive,
        findText: findReplaceState.findText,
        index: findReplaceState.index,
        numMatches: findReplaceState.matches.length,
        replaceText: findReplaceState.replaceText,
        shouldFocus: findReplaceState.shouldFocus,
        popupsBoundariesElement: popupsBoundariesElement,
        popupsMountPoint: popupsMountPoint,
        popupsScrollableElement: popupsScrollableElement,
        isReducedSpacing: !!isToolbarReducedSpacing,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        onFindBlur: handleFindBlur,
        onCancel: handleCancel,
        onActivate: handleActivate,
        onFind: handleFind,
        onFindNext: handleFindNext,
        onFindPrev: handleFindPrev,
        onReplace: handleReplace,
        onReplaceAll: handleReplaceAll,
        takeFullWidth: !!props.takeFullWidth
      });
    }
  });
};

var _default = FindReplaceToolbarButtonWithState;
exports.default = _default;