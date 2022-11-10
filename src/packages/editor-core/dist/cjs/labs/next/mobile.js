"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mobile = void 0;
exports.MobileEditor = MobileEditor;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _analyticsNext = require("@atlaskit/analytics-next");

var _Mobile = require("../../ui/AppearanceComponents/Mobile");

var _Editor = require("./Editor");

var _useAnalytics = require("./internal/hooks/use-analytics");

var _contextAdapter = require("../../nodeviews/context-adapter");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function MobileEditor(props) {
  var maxHeight = props.maxHeight,
      createAnalyticsEvent = props.createAnalyticsEvent,
      disabled = props.disabled;
  var handleAnalyticsEvent = (0, _useAnalytics.useCreateAnalyticsHandler)(createAnalyticsEvent);
  var renderWithConfig = (0, _react.useCallback)(function (config) {
    return /*#__PURE__*/_react.default.createElement(_Mobile.MobileAppearance, {
      editorView: config && config.editorView,
      maxHeight: maxHeight,
      editorDisabled: disabled
    }, /*#__PURE__*/_react.default.createElement(_Editor.EditorContent, null));
  }, [maxHeight, disabled]);
  return /*#__PURE__*/_react.default.createElement(_contextAdapter.ContextAdapter, null, /*#__PURE__*/_react.default.createElement(_Editor.Editor, (0, _extends2.default)({}, props, {
    onAnalyticsEvent: handleAnalyticsEvent
  }), /*#__PURE__*/_react.default.createElement(_Editor.EditorSharedConfigConsumer, null, renderWithConfig)));
}

MobileEditor.displayName = 'MobileEditor';
var Mobile = (0, _analyticsNext.withAnalyticsEvents)()(MobileEditor);
exports.Mobile = Mobile;