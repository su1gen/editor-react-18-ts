"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEditor = createEditor;

var _prosemirrorView = require("prosemirror-view");

var _prosemirrorState = require("prosemirror-state");

var _eventDispatcher = require("../../../../../event-dispatcher");

var _createEditor = require("../../../../../create-editor/create-editor");

var _utils = require("../../../../../utils");

var _createSchema = require("../../../../../create-editor/create-schema");

function createEditor(_ref) {
  var context = _ref.context,
      onAnalyticsEvent = _ref.onAnalyticsEvent,
      transformer = _ref.transformer,
      providerFactory = _ref.providerFactory,
      plugins = _ref.plugins,
      portalProviderAPI = _ref.portalProviderAPI,
      defaultValue = _ref.defaultValue,
      ref = _ref.ref,
      popupsMountPoint = _ref.popupsMountPoint,
      popupsBoundariesElement = _ref.popupsBoundariesElement,
      popupsScrollableElement = _ref.popupsScrollableElement,
      editorActions = _ref.editorActions,
      disabled = _ref.disabled,
      onChange = _ref.onChange,
      onDestroy = _ref.onDestroy,
      onMount = _ref.onMount,
      featureFlags = _ref.featureFlags,
      getIntl = _ref.getIntl;

  if (!ref) {
    return null;
  }

  var eventDispatcher = new _eventDispatcher.EventDispatcher();
  var dispatch = (0, _eventDispatcher.createDispatch)(eventDispatcher);
  var editorConfig = (0, _createEditor.processPluginsList)(plugins || []);
  var schema = (0, _createSchema.createSchema)(editorConfig);
  var transformerInstance = transformer && transformer(schema);
  var pmPlugins = (0, _createEditor.createPMPlugins)({
    editorConfig: editorConfig,
    schema: schema,
    dispatch: dispatch,
    eventDispatcher: eventDispatcher,
    portalProviderAPI: portalProviderAPI,
    providerFactory: providerFactory,
    // Required to workaround issues with multiple react trees.
    // Though it's kinda leaking react to outside world.
    reactContext: function reactContext() {
      return context;
    },
    // TODO: ED-8133 Need to make types more generic otherwise it's not extensible.
    dispatchAnalyticsEvent: onAnalyticsEvent,
    performanceTracking: {},
    featureFlags: featureFlags,
    getIntl: getIntl
  });

  var state = _prosemirrorState.EditorState.create({
    schema: schema,
    plugins: pmPlugins,
    doc: transformerInstance ? transformerInstance.parse(defaultValue) : (0, _utils.processRawValue)(schema, defaultValue)
  });

  var editorView = new _prosemirrorView.EditorView({
    mount: ref
  }, {
    state: state,
    attributes: {
      'data-gramm': 'false'
    },
    // Ignore all transactions by default
    dispatchTransaction: function dispatchTransaction() {},
    // Disables the contentEditable attribute of the editor if the editor is disabled
    editable: function editable(_state) {
      return !!disabled;
    }
  });
  return {
    editorView: editorView,
    transformer: transformerInstance,
    dispatchAnalyticsEvent: onAnalyticsEvent,
    eventDispatcher: eventDispatcher,
    dispatch: dispatch,
    primaryToolbarComponents: editorConfig.primaryToolbarComponents,
    contentComponents: editorConfig.contentComponents,
    popupsMountPoint: popupsMountPoint,
    popupsBoundariesElement: popupsBoundariesElement,
    popupsScrollableElement: popupsScrollableElement,
    providerFactory: providerFactory,
    editorActions: editorActions,
    onChange: onChange,
    onDestroy: onDestroy,
    onMount: onMount
  };
}