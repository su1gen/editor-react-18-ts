"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createErrorReporter = createErrorReporter;
exports.createPMPlugins = createPMPlugins;
exports.fixExcludes = fixExcludes;
exports.processPluginsList = processPluginsList;
exports.sortByRank = sortByRank;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _utils = require("@atlaskit/editor-common/utils");

var _sortByOrder = require("./sort-by-order");

var _instrumentedPlugin = require("../utils/performance/instrumented-plugin");

function sortByRank(a, b) {
  return a.rank - b.rank;
}

function fixExcludes(marks) {
  var markKeys = Object.keys(marks);
  var markGroups = new Set(markKeys.map(function (mark) {
    return marks[mark].group;
  }));
  markKeys.forEach(function (markKey) {
    var mark = marks[markKey];

    if (mark.excludes) {
      mark.excludes = mark.excludes.split(' ').filter(function (group) {
        return markGroups.has(group);
      }).join(' ');
    }
  });
  return marks;
}

function processPluginsList(plugins) {
  /**
   * First pass to collect pluginsOptions
   */
  var pluginsOptions = plugins.reduce(function (acc, plugin) {
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

  return plugins.reduce(function (acc, plugin) {
    if (plugin.pmPlugins) {
      var _acc$pmPlugins;

      (_acc$pmPlugins = acc.pmPlugins).push.apply(_acc$pmPlugins, (0, _toConsumableArray2.default)(plugin.pmPlugins(plugin.name ? pluginsOptions[plugin.name] : undefined)));
    }

    if (plugin.nodes) {
      var _acc$nodes;

      (_acc$nodes = acc.nodes).push.apply(_acc$nodes, (0, _toConsumableArray2.default)(plugin.nodes()));
    }

    if (plugin.marks) {
      var _acc$marks;

      (_acc$marks = acc.marks).push.apply(_acc$marks, (0, _toConsumableArray2.default)(plugin.marks()));
    }

    if (plugin.contentComponent) {
      acc.contentComponents.push(plugin.contentComponent);
    }

    if (plugin.primaryToolbarComponent) {
      acc.primaryToolbarComponents.push(plugin.primaryToolbarComponent);
    }

    if (plugin.secondaryToolbarComponent) {
      acc.secondaryToolbarComponents.push(plugin.secondaryToolbarComponent);
    }

    if (plugin.onEditorViewStateUpdated) {
      acc.onEditorViewStateUpdatedCallbacks.push({
        pluginName: plugin.name,
        callback: plugin.onEditorViewStateUpdated
      });
    }

    return acc;
  }, {
    nodes: [],
    marks: [],
    pmPlugins: [],
    contentComponents: [],
    primaryToolbarComponents: [],
    secondaryToolbarComponents: [],
    onEditorViewStateUpdatedCallbacks: []
  });
}

var TRACKING_DEFAULT = {
  enabled: false
};

function createPMPlugins(config) {
  var editorConfig = config.editorConfig,
      _config$performanceTr = config.performanceTracking,
      performanceTracking = _config$performanceTr === void 0 ? {} : _config$performanceTr,
      transactionTracker = config.transactionTracker,
      featureFlags = config.featureFlags,
      dispatchAnalyticsEvent = config.dispatchAnalyticsEvent;
  var _performanceTracking$ = performanceTracking.uiTracking,
      uiTracking = _performanceTracking$ === void 0 ? TRACKING_DEFAULT : _performanceTracking$,
      _performanceTracking$2 = performanceTracking.transactionTracking,
      transactionTracking = _performanceTracking$2 === void 0 ? TRACKING_DEFAULT : _performanceTracking$2;
  var saferDispatchedTransactions = featureFlags.saferDispatchedTransactions;
  var useInstrumentedPlugin = uiTracking.enabled || transactionTracking.enabled || saferDispatchedTransactions;

  if (process.env.NODE_ENV === 'development' && transactionTracking.enabled && !transactionTracker) {
    // eslint-disable-next-line no-console
    console.warn('createPMPlugins(): tracking is turned on but transactionTracker not defined! Transaction tracking has been disabled');
  }

  var instrumentPlugin = useInstrumentedPlugin ? function (plugin) {
    return _instrumentedPlugin.InstrumentedPlugin.fromPlugin(plugin, {
      uiTracking: uiTracking,
      transactionTracking: transactionTracking,
      saferDispatchedTransactions: saferDispatchedTransactions,
      dispatchAnalyticsEvent: dispatchAnalyticsEvent
    }, transactionTracker);
  } : function (plugin) {
    return plugin;
  };
  return editorConfig.pmPlugins.sort((0, _sortByOrder.sortByOrder)('plugins')).map(function (_ref) {
    var plugin = _ref.plugin;
    return plugin({
      schema: config.schema,
      dispatch: config.dispatch,
      eventDispatcher: config.eventDispatcher,
      providerFactory: config.providerFactory,
      errorReporter: config.errorReporter,
      portalProviderAPI: config.portalProviderAPI,
      reactContext: config.reactContext,
      dispatchAnalyticsEvent: config.dispatchAnalyticsEvent,
      featureFlags: config.featureFlags || {},
      getIntl: config.getIntl
    });
  }).filter(function (plugin) {
    return typeof plugin !== 'undefined';
  }).map(instrumentPlugin);
}

function createErrorReporter(errorReporterHandler) {
  var errorReporter = new _utils.ErrorReporter();

  if (errorReporterHandler) {
    errorReporter.handler = errorReporterHandler;
  }

  return errorReporter;
}