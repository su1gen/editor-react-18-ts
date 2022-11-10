import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { TextSelection } from 'prosemirror-state';
import { sortByOrder } from './create-editor/sort-by-order';
import { Preset } from './labs/next/presets/preset';
import { createSchema } from './create-editor/create-schema';
import basePlugin from './plugins/base';
import { analyticsPluginKey } from './plugins/analytics/plugin-key';
export { createTypeAheadTools } from './plugins/type-ahead/api';
export { Preset } from './labs/next/presets/preset';
export function getFireAnalytics(editorView) {
  var _analyticsPluginKey$g;

  return analyticsPluginKey === null || analyticsPluginKey === void 0 ? void 0 : (_analyticsPluginKey$g = analyticsPluginKey.getState(editorView.state)) === null || _analyticsPluginKey$g === void 0 ? void 0 : _analyticsPluginKey$g.fireAnalytics;
}

function lightProcessPluginsList(editorPlugins) {
  /**
   * First pass to collect pluginsOptions
   */
  var pluginsOptions = editorPlugins.reduce(function (acc, plugin) {
    if (plugin.pluginsOptions) {
      Object.keys(plugin.pluginsOptions).forEach(function (pluginName) {
        if (!acc[pluginName]) {
          acc[pluginName] = [];
        }

        acc[pluginName].push(plugin.pluginsOptions[pluginName]);
      });
    }

    return acc;
  }, {});
  /**
   * Process plugins
   */

  return editorPlugins.reduce(function (acc, editorPlugin) {
    if (editorPlugin.pmPlugins) {
      var _acc$plugins;

      (_acc$plugins = acc.plugins).push.apply(_acc$plugins, _toConsumableArray(editorPlugin.pmPlugins(editorPlugin.name ? pluginsOptions[editorPlugin.name] : undefined)));
    }

    if (editorPlugin.marks) {
      var _acc$marks;

      (_acc$marks = acc.marks).push.apply(_acc$marks, _toConsumableArray(editorPlugin.marks()));
    }

    if (editorPlugin.nodes) {
      var _acc$nodes;

      (_acc$nodes = acc.nodes).push.apply(_acc$nodes, _toConsumableArray(editorPlugin.nodes()));
    }

    if (editorPlugin.onEditorViewStateUpdated) {
      acc.onEditorViewStateUpdatedCallbacks.push(editorPlugin.onEditorViewStateUpdated);
    }

    return acc;
  }, {
    nodes: [],
    marks: [],
    plugins: [],
    onEditorViewStateUpdatedCallbacks: []
  });
}

export var createPMSchemaAndPlugins = function createPMSchemaAndPlugins() {
  var preset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Preset();
  return function (pluginFactoryParams) {
    var editorPlugins = [];

    if (!preset.has(basePlugin)) {
      preset.add(basePlugin);
    }

    editorPlugins = preset.getEditorPlugins();
    var editorConfig = lightProcessPluginsList(editorPlugins);
    var schema = createSchema(editorConfig);
    var plugins = editorConfig.plugins.sort(sortByOrder('plugins')).map(function (_ref) {
      var plugin = _ref.plugin;
      return plugin(_objectSpread(_objectSpread({}, pluginFactoryParams), {}, {
        schema: schema
      }));
    }).filter(function (plugin) {
      return !!plugin;
    });
    return {
      plugins: plugins,
      schema: schema,
      onEditorViewStateUpdatedCallbacks: editorConfig.onEditorViewStateUpdatedCallbacks
    };
  };
};
export { PortalProviderAPI } from './ui/PortalProvider';
export { EventDispatcher } from './event-dispatcher';
export { GapCursorSelection, Side as GapCursorSide } from './plugins/selection/gap-cursor/selection';
export function setTextSelection(view, anchor, head) {
  var state = view.state;
  var tr = state.tr.setSelection(TextSelection.create(state.doc, anchor, head));
  view.dispatch(tr);
}