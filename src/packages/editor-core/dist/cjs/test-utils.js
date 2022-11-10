"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "EventDispatcher", {
  enumerable: true,
  get: function get() {
    return _eventDispatcher.EventDispatcher;
  }
});
Object.defineProperty(exports, "GapCursorSelection", {
  enumerable: true,
  get: function get() {
    return _selection.GapCursorSelection;
  }
});
Object.defineProperty(exports, "GapCursorSide", {
  enumerable: true,
  get: function get() {
    return _selection.Side;
  }
});
Object.defineProperty(exports, "PortalProviderAPI", {
  enumerable: true,
  get: function get() {
    return _PortalProvider.PortalProviderAPI;
  }
});
Object.defineProperty(exports, "Preset", {
  enumerable: true,
  get: function get() {
    return _preset.Preset;
  }
});
exports.createPMSchemaAndPlugins = void 0;
Object.defineProperty(exports, "createTypeAheadTools", {
  enumerable: true,
  get: function get() {
    return _api.createTypeAheadTools;
  }
});
exports.getFireAnalytics = getFireAnalytics;
exports.setTextSelection = setTextSelection;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _prosemirrorState = require("prosemirror-state");

var _sortByOrder = require("./create-editor/sort-by-order");

var _preset = require("./labs/next/presets/preset");

var _createSchema = require("./create-editor/create-schema");

var _base = _interopRequireDefault(require("./plugins/base"));

var _pluginKey = require("./plugins/analytics/plugin-key");

var _api = require("./plugins/type-ahead/api");

var _PortalProvider = require("./ui/PortalProvider");

var _eventDispatcher = require("./event-dispatcher");

var _selection = require("./plugins/selection/gap-cursor/selection");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function getFireAnalytics(editorView) {
  var _analyticsPluginKey$g;

  return _pluginKey.analyticsPluginKey === null || _pluginKey.analyticsPluginKey === void 0 ? void 0 : (_analyticsPluginKey$g = _pluginKey.analyticsPluginKey.getState(editorView.state)) === null || _analyticsPluginKey$g === void 0 ? void 0 : _analyticsPluginKey$g.fireAnalytics;
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

      (_acc$plugins = acc.plugins).push.apply(_acc$plugins, (0, _toConsumableArray2.default)(editorPlugin.pmPlugins(editorPlugin.name ? pluginsOptions[editorPlugin.name] : undefined)));
    }

    if (editorPlugin.marks) {
      var _acc$marks;

      (_acc$marks = acc.marks).push.apply(_acc$marks, (0, _toConsumableArray2.default)(editorPlugin.marks()));
    }

    if (editorPlugin.nodes) {
      var _acc$nodes;

      (_acc$nodes = acc.nodes).push.apply(_acc$nodes, (0, _toConsumableArray2.default)(editorPlugin.nodes()));
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

var createPMSchemaAndPlugins = function createPMSchemaAndPlugins() {
  var preset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _preset.Preset();
  return function (pluginFactoryParams) {
    var editorPlugins = [];

    if (!preset.has(_base.default)) {
      preset.add(_base.default);
    }

    editorPlugins = preset.getEditorPlugins();
    var editorConfig = lightProcessPluginsList(editorPlugins);
    var schema = (0, _createSchema.createSchema)(editorConfig);
    var plugins = editorConfig.plugins.sort((0, _sortByOrder.sortByOrder)('plugins')).map(function (_ref) {
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

exports.createPMSchemaAndPlugins = createPMSchemaAndPlugins;

function setTextSelection(view, anchor, head) {
  var state = view.state;
  var tr = state.tr.setSelection(_prosemirrorState.TextSelection.create(state.doc, anchor, head));
  view.dispatch(tr);
}