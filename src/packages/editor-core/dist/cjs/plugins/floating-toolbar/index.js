"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.getRelevantConfig = exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _camelCase = _interopRequireDefault(require("lodash/camelCase"));

var _ui = require("@atlaskit/editor-common/ui");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _types = require("../analytics/types");

var _analytics = require("../analytics");

var _pluginKey = require("../extension/plugin-key");

var _editorDisabled = require("../editor-disabled");

var _pluginKey2 = require("./pm-plugins/toolbar-data/plugin-key");

var _plugin = require("./pm-plugins/toolbar-data/plugin");

var _commands = require("./pm-plugins/toolbar-data/commands");

var _ConfirmationModal = require("./ui/ConfirmationModal");

var _ToolbarLoader = require("./ui/ToolbarLoader");

var _utils = require("./utils");

var _ErrorBoundary = require("../../ui/ErrorBoundary");

var _featureFlagsContext = require("../feature-flags-context");

var _toolbar = require("../copy-button/toolbar");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var getRelevantConfig = function getRelevantConfig(selection, configs) {
  // node selections always take precedence, see if
  var configPair;
  configs.find(function (config) {
    var node = (0, _prosemirrorUtils.findSelectedNodeOfType)(config.nodeType)(selection);

    if (node) {
      configPair = {
        node: node.node,
        pos: node.pos,
        config: config
      };
    }

    return !!node;
  });

  if (configPair) {
    return configPair;
  } // create mapping of node type name to configs


  var configByNodeType = {};
  configs.forEach(function (config) {
    if (Array.isArray(config.nodeType)) {
      config.nodeType.forEach(function (nodeType) {
        configByNodeType[nodeType.name] = config;
      });
    } else {
      configByNodeType[config.nodeType.name] = config;
    }
  }); // search up the tree from selection

  var $from = selection.$from;

  for (var i = $from.depth; i > 0; i--) {
    var node = $from.node(i);
    var matchedConfig = configByNodeType[node.type.name];

    if (matchedConfig) {
      return {
        config: matchedConfig,
        node: node,
        pos: $from.pos
      };
    }
  } // if it is AllSelection (can be result of Cmd+A) - use first node


  if (selection instanceof _prosemirrorState.AllSelection) {
    var docNode = $from.node(0);
    var _matchedConfig = null;
    var firstChild = (0, _utils.findNode)(docNode, function (node) {
      _matchedConfig = configByNodeType[node.type.name];
      return !!_matchedConfig;
    });

    if (firstChild && _matchedConfig) {
      return {
        config: _matchedConfig,
        node: firstChild,
        pos: $from.pos
      };
    }
  }

  return;
};

exports.getRelevantConfig = getRelevantConfig;

var getDomRefFromSelection = function getDomRefFromSelection(view, dispatchAnalyticsEvent) {
  try {
    return (0, _prosemirrorUtils.findDomRefAtPos)(view.state.selection.from, view.domAtPos.bind(view));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);

    if (dispatchAnalyticsEvent) {
      var payload = {
        action: _analytics.ACTION.ERRORED,
        actionSubject: _analytics.ACTION_SUBJECT.CONTENT_COMPONENT,
        eventType: _analytics.EVENT_TYPE.OPERATIONAL,
        attributes: {
          component: _types.CONTENT_COMPONENT.FLOATING_TOOLBAR,
          selection: view.state.selection.toJSON(),
          position: view.state.selection.from,
          docSize: view.state.doc.nodeSize,
          error: error.toString(),
          errorStack: error.stack || undefined
        }
      };
      dispatchAnalyticsEvent(payload);
    }
  }
};

function filterUndefined(x) {
  return !!x;
}

var floatingToolbarPlugin = function floatingToolbarPlugin() {
  return {
    name: 'floatingToolbar',
    pmPlugins: function pmPlugins() {
      var floatingToolbarHandlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return [{
        // Should be after all toolbar plugins
        name: 'floatingToolbar',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              providerFactory = _ref.providerFactory,
              getIntl = _ref.getIntl;
          return floatingToolbarPluginFactory({
            floatingToolbarHandlers: floatingToolbarHandlers,
            dispatch: dispatch,
            providerFactory: providerFactory,
            getIntl: getIntl
          });
        }
      }, {
        name: 'floatingToolbarData',
        plugin: function plugin(_ref2) {
          var dispatch = _ref2.dispatch;
          return (0, _plugin.createPlugin)(dispatch);
        }
      }];
    },
    contentComponent: function contentComponent(_ref3) {
      var popupsMountPoint = _ref3.popupsMountPoint,
          popupsBoundariesElement = _ref3.popupsBoundariesElement,
          popupsScrollableElement = _ref3.popupsScrollableElement,
          editorView = _ref3.editorView,
          providerFactory = _ref3.providerFactory,
          dispatchAnalyticsEvent = _ref3.dispatchAnalyticsEvent;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          floatingToolbarState: pluginKey,
          floatingToolbarData: _pluginKey2.pluginKey,
          editorDisabledPlugin: _editorDisabled.pluginKey,
          extensionsState: _pluginKey.pluginKey
        },
        render: function render(_ref4) {
          var _configWithNodeInfo$c, _configWithNodeInfo$c2;

          var editorDisabledPlugin = _ref4.editorDisabledPlugin,
              floatingToolbarState = _ref4.floatingToolbarState,
              floatingToolbarData = _ref4.floatingToolbarData,
              extensionsState = _ref4.extensionsState;
          var configWithNodeInfo = floatingToolbarState === null || floatingToolbarState === void 0 ? void 0 : floatingToolbarState.getConfigWithNodeInfo(editorView.state);

          if (!configWithNodeInfo || !configWithNodeInfo.config || typeof ((_configWithNodeInfo$c = configWithNodeInfo.config) === null || _configWithNodeInfo$c === void 0 ? void 0 : _configWithNodeInfo$c.visible) !== 'undefined' && !((_configWithNodeInfo$c2 = configWithNodeInfo.config) !== null && _configWithNodeInfo$c2 !== void 0 && _configWithNodeInfo$c2.visible)) {
            return null;
          }

          var config = configWithNodeInfo.config,
              node = configWithNodeInfo.node;
          var title = config.title,
              _config$getDomRef = config.getDomRef,
              getDomRef = _config$getDomRef === void 0 ? getDomRefFromSelection : _config$getDomRef,
              items = config.items,
              _config$align = config.align,
              align = _config$align === void 0 ? 'center' : _config$align,
              _config$className = config.className,
              className = _config$className === void 0 ? '' : _config$className,
              height = config.height,
              width = config.width,
              _config$offset = config.offset,
              offset = _config$offset === void 0 ? [0, 12] : _config$offset,
              forcePlacement = config.forcePlacement,
              onPositionCalculated = config.onPositionCalculated;
          var targetRef = getDomRef(editorView, dispatchAnalyticsEvent);

          if (!targetRef || editorDisabledPlugin && editorDisabledPlugin.editorDisabled) {
            return null;
          }

          var customPositionCalculation;
          var toolbarItems = (0, _toolbar.processCopyButtonItems)(editorView.state)(Array.isArray(items) ? items : items(node));

          if (onPositionCalculated) {
            customPositionCalculation = function customPositionCalculation(nextPos) {
              return onPositionCalculated(editorView, nextPos);
            };
          }

          var dispatchCommand = function dispatchCommand(fn) {
            return fn && fn(editorView.state, editorView.dispatch, editorView);
          }; // Confirm dialog


          var _ref5 = floatingToolbarData || {},
              confirmDialogForItem = _ref5.confirmDialogForItem;

          var confirmButtonItem = confirmDialogForItem ? toolbarItems[confirmDialogForItem] : undefined;
          var scrollable = (0, _featureFlagsContext.getFeatureFlags)(editorView.state).floatingToolbarCopyButton && config.scrollable;
          return /*#__PURE__*/_react.default.createElement(_ErrorBoundary.ErrorBoundary, {
            component: _analytics.ACTION_SUBJECT.FLOATING_TOOLBAR_PLUGIN,
            componentId: (0, _camelCase.default)(title),
            dispatchAnalyticsEvent: dispatchAnalyticsEvent,
            fallbackComponent: null
          }, /*#__PURE__*/_react.default.createElement(_ui.Popup, {
            ariaLabel: title,
            offset: offset,
            target: targetRef,
            alignY: "bottom",
            forcePlacement: forcePlacement,
            fitHeight: height,
            fitWidth: width,
            alignX: align,
            stick: true,
            mountTo: popupsMountPoint,
            boundariesElement: popupsBoundariesElement,
            scrollableElement: popupsScrollableElement,
            onPositionCalculated: customPositionCalculation,
            style: scrollable ? {
              maxWidth: '100%'
            } : {}
          }, /*#__PURE__*/_react.default.createElement(_ToolbarLoader.ToolbarLoader, {
            target: targetRef,
            items: toolbarItems,
            node: node,
            dispatchCommand: dispatchCommand,
            editorView: editorView,
            className: className,
            focusEditor: function focusEditor() {
              return editorView.focus();
            },
            providerFactory: providerFactory,
            popupsMountPoint: popupsMountPoint,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsScrollableElement: popupsScrollableElement,
            dispatchAnalyticsEvent: dispatchAnalyticsEvent,
            extensionsProvider: extensionsState === null || extensionsState === void 0 ? void 0 : extensionsState.extensionProvider,
            scrollable: scrollable
          })), /*#__PURE__*/_react.default.createElement(_ConfirmationModal.ConfirmationModal, {
            options: confirmButtonItem === null || confirmButtonItem === void 0 ? void 0 : confirmButtonItem.confirmDialog,
            onConfirm: function onConfirm() {
              dispatchCommand(confirmButtonItem.onClick);
              dispatchCommand((0, _commands.hideConfirmDialog)());
            } // When closed without clicking OK or cancel buttons
            ,
            onClose: function onClose() {
              dispatchCommand((0, _commands.hideConfirmDialog)());
            }
          }));
        }
      });
    }
  };
};

var _default = floatingToolbarPlugin;
/**
 *
 * ProseMirror Plugin
 *
 */
// We throttle update of this plugin with RAF.
// So from other plugins you will always get the previous state.

exports.default = _default;
var pluginKey = new _prosemirrorState.PluginKey('floatingToolbarPluginKey');
/**
 * Clean up floating toolbar configs from undesired properties.
 */

exports.pluginKey = pluginKey;

function sanitizeFloatingToolbarConfig(config) {
  // Cleanup from non existing node types
  if (Array.isArray(config.nodeType)) {
    return _objectSpread(_objectSpread({}, config), {}, {
      nodeType: config.nodeType.filter(filterUndefined)
    });
  }

  return config;
}

function floatingToolbarPluginFactory(options) {
  var floatingToolbarHandlers = options.floatingToolbarHandlers,
      dispatch = options.dispatch,
      providerFactory = options.providerFactory,
      getIntl = options.getIntl;
  var intl = getIntl();

  var getConfigWithNodeInfo = function getConfigWithNodeInfo(editorState) {
    var activeConfigs = floatingToolbarHandlers.map(function (handler) {
      return handler(editorState, intl, providerFactory);
    }).filter(filterUndefined).map(function (config) {
      return sanitizeFloatingToolbarConfig(config);
    });
    var relevantConfig = activeConfigs && getRelevantConfig(editorState.selection, activeConfigs);
    return relevantConfig;
  };

  var apply = function apply(tr, pluginState) {
    var newPluginState = {
      getConfigWithNodeInfo: getConfigWithNodeInfo
    };
    dispatch(pluginKey, newPluginState);
    return newPluginState;
  };

  return new _safePlugin.SafePlugin({
    key: pluginKey,
    state: {
      init: function init() {
        // Use this point to preload the UI
        _ToolbarLoader.ToolbarLoader.preload();

        return {
          getConfigWithNodeInfo: getConfigWithNodeInfo
        };
      },
      apply: apply
    }
  });
}