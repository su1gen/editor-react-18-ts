"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorInternal = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ui = require("@atlaskit/editor-common/ui");

var _reactIntlNext = require("react-intl-next");

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _EditorContext = _interopRequireDefault(require("../../../../ui/EditorContext"));

var _actions = _interopRequireDefault(require("../../../../actions"));

var _sharedConfig = require("../context/shared-config");

var _useEditor3 = require("../hooks/use-editor");

var _EditorContent = require("./EditorContent");

function BaseEditorInternal(_ref, context) {
  var onAnalyticsEvent = _ref.onAnalyticsEvent,
      disabled = _ref.disabled,
      transformer = _ref.transformer,
      defaultValue = _ref.defaultValue,
      plugins = _ref.plugins,
      portalProviderAPI = _ref.portalProviderAPI,
      popupsMountPoint = _ref.popupsMountPoint,
      popupsBoundariesElement = _ref.popupsBoundariesElement,
      popupsScrollableElement = _ref.popupsScrollableElement,
      onChange = _ref.onChange,
      onDestroy = _ref.onDestroy,
      onMount = _ref.onMount,
      children = _ref.children,
      intl = _ref.intl;
  // Need to memoize editor actions otherwise in case when editor is not
  // wrapped with EditorContext every prop change triggers all hooks
  // that depend on editorActions
  var maybeEditorActions = (context || {}).editorActions;

  var editorActions = _react.default.useMemo(function () {
    return maybeEditorActions || new _actions.default();
  }, [maybeEditorActions]); // Get the provider factory from context


  var providerFactory = (0, _providerFactory.useProviderFactory)();

  var getIntl = function getIntl() {
    return intl;
  };

  var _useEditor = (0, _useEditor3.useEditor)({
    context: context,
    editorActions: editorActions,
    onAnalyticsEvent: onAnalyticsEvent,
    disabled: disabled,
    transformer: transformer,
    defaultValue: defaultValue,
    plugins: plugins,
    portalProviderAPI: portalProviderAPI,
    popupsMountPoint: popupsMountPoint,
    popupsBoundariesElement: popupsBoundariesElement,
    popupsScrollableElement: popupsScrollableElement,
    onChange: onChange,
    onDestroy: onDestroy,
    onMount: onMount,
    providerFactory: providerFactory,
    featureFlags: {},
    getIntl: getIntl
  }),
      _useEditor2 = (0, _slicedToArray2.default)(_useEditor, 2),
      editorSharedConfig = _useEditor2[0],
      mountEditor = _useEditor2[1];

  return /*#__PURE__*/_react.default.createElement(_ui.WidthProvider, null, /*#__PURE__*/_react.default.createElement(_EditorContext.default, {
    editorActions: editorActions
  }, /*#__PURE__*/_react.default.createElement(_sharedConfig.EditorSharedConfigProvider, {
    value: editorSharedConfig
  }, /*#__PURE__*/_react.default.createElement(_EditorContent.EditorContentProvider, {
    value: mountEditor
  }, children))));
}

BaseEditorInternal.contextTypes = {
  editorActions: _propTypes.default.object
};
var EditorInternal = (0, _reactIntlNext.injectIntl)(BaseEditorInternal);
exports.EditorInternal = EditorInternal;