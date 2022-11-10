import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, AllSelection } from 'prosemirror-state';
import { findDomRefAtPos, findSelectedNodeOfType } from 'prosemirror-utils';
import camelCase from 'lodash/camelCase';
import { Popup } from '@atlaskit/editor-common/ui'; // AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points

import WithPluginState from '../../ui/WithPluginState';
import { CONTENT_COMPONENT } from '../analytics/types';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
import { pluginKey as extensionsPluginKey } from '../extension/plugin-key';
import { pluginKey as editorDisabledPluginKey } from '../editor-disabled';
import { pluginKey as dataPluginKey } from './pm-plugins/toolbar-data/plugin-key';
import { createPlugin as floatingToolbarDataPluginFactory } from './pm-plugins/toolbar-data/plugin';
import { hideConfirmDialog } from './pm-plugins/toolbar-data/commands';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { ToolbarLoader } from './ui/ToolbarLoader';
import { findNode } from './utils';
import { ErrorBoundary } from '../../ui/ErrorBoundary';
import { getFeatureFlags } from '../feature-flags-context';
import { processCopyButtonItems } from '../copy-button/toolbar';
export var getRelevantConfig = function getRelevantConfig(selection, configs) {
  // node selections always take precedence, see if
  var configPair;
  configs.find(function (config) {
    var node = findSelectedNodeOfType(config.nodeType)(selection);

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


  if (selection instanceof AllSelection) {
    var docNode = $from.node(0);
    var _matchedConfig = null;
    var firstChild = findNode(docNode, function (node) {
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

var getDomRefFromSelection = function getDomRefFromSelection(view, dispatchAnalyticsEvent) {
  try {
    return findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);

    if (dispatchAnalyticsEvent) {
      var payload = {
        action: ACTION.ERRORED,
        actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          component: CONTENT_COMPONENT.FLOATING_TOOLBAR,
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
          return floatingToolbarDataPluginFactory(dispatch);
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
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          floatingToolbarState: pluginKey,
          floatingToolbarData: dataPluginKey,
          editorDisabledPlugin: editorDisabledPluginKey,
          extensionsState: extensionsPluginKey
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
          var toolbarItems = processCopyButtonItems(editorView.state)(Array.isArray(items) ? items : items(node));

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
          var scrollable = getFeatureFlags(editorView.state).floatingToolbarCopyButton && config.scrollable;
          return /*#__PURE__*/React.createElement(ErrorBoundary, {
            component: ACTION_SUBJECT.FLOATING_TOOLBAR_PLUGIN,
            componentId: camelCase(title),
            dispatchAnalyticsEvent: dispatchAnalyticsEvent,
            fallbackComponent: null
          }, /*#__PURE__*/React.createElement(Popup, {
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
          }, /*#__PURE__*/React.createElement(ToolbarLoader, {
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
          })), /*#__PURE__*/React.createElement(ConfirmationModal, {
            options: confirmButtonItem === null || confirmButtonItem === void 0 ? void 0 : confirmButtonItem.confirmDialog,
            onConfirm: function onConfirm() {
              dispatchCommand(confirmButtonItem.onClick);
              dispatchCommand(hideConfirmDialog());
            } // When closed without clicking OK or cancel buttons
            ,
            onClose: function onClose() {
              dispatchCommand(hideConfirmDialog());
            }
          }));
        }
      });
    }
  };
};

export default floatingToolbarPlugin;
/**
 *
 * ProseMirror Plugin
 *
 */
// We throttle update of this plugin with RAF.
// So from other plugins you will always get the previous state.

export var pluginKey = new PluginKey('floatingToolbarPluginKey');
/**
 * Clean up floating toolbar configs from undesired properties.
 */

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

  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init() {
        // Use this point to preload the UI
        ToolbarLoader.preload();
        return {
          getConfigWithNodeInfo: getConfigWithNodeInfo
        };
      },
      apply: apply
    }
  });
}