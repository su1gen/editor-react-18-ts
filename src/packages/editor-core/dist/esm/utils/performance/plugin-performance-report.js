import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { outlier } from './outlier';
import { EVENT_NAME_STATE_APPLY, EVENT_NAME_UPDATE_STATE, EVENT_NAME_ON_CHANGE, EVENT_NAME_VIEW_STATE_UPDATED } from './track-transactions';
export var PluginPerformanceReport = /*#__PURE__*/function () {
  function PluginPerformanceReport(entry) {
    var _this = this;

    _classCallCheck(this, PluginPerformanceReport);

    _defineProperty(this, "count", 0);

    _defineProperty(this, "pluginNames", []);

    _defineProperty(this, "nodes", {});

    _defineProperty(this, "extensionNodes", {});

    _defineProperty(this, "nodesDuration", 0);

    _defineProperty(this, "plugins", {});

    _defineProperty(this, "slowPlugins", {});

    _defineProperty(this, "options", {
      samplingRate: 100,
      slowThreshold: 300,
      outlierThreshold: 30,
      outlierFactor: 3
    });

    _defineProperty(this, "isChild", function (child) {
      return child.startTime >= _this.entry.startTime && child.startTime + child.duration <= _this.entry.startTime + _this.entry.duration;
    });

    this.entry = entry;
  }

  _createClass(PluginPerformanceReport, [{
    key: "getEntryByName",
    value: function getEntryByName(entryList, name) {
      return entryList.getEntriesByName(name).find(this.isChild);
    }
  }, {
    key: "getMethodSum",
    value: function getMethodSum(methods) {
      return Object.values(methods).reduce(function (a, b) {
        return a + b;
      }, 0);
    }
  }, {
    key: "greaterEquals",
    value: function greaterEquals(a, b) {
      return typeof b === 'number' ? a >= b : false;
    }
  }, {
    key: "hasOutlierMethods",
    value: function hasOutlierMethods(methods, outliers) {
      return this.greaterEquals(methods.stateApply, outliers.stateApplyOutlier) || this.greaterEquals(methods.viewUpdate, outliers.viewUpdateOutlier);
    }
  }, {
    key: "trigger",
    get: function get() {
      if (this.entry.duration > this.options.slowThreshold) {
        return 'slow';
      } else if (this.hasSlowPlugins && this.entry.duration > this.options.outlierThreshold) {
        return 'distribution';
      } else if (this.count > 0 && this.count % this.options.samplingRate === 0) {
        return 'sample';
      } else {
        return 'none';
      }
    }
  }, {
    key: "hasSlowPlugins",
    get: function get() {
      return Object.keys(this.slowPlugins).length > 0;
    }
  }, {
    key: "withEntryList",
    value: function withEntryList(entryList) {
      this.entryList = entryList;
      this.stateApplied = this.getEntryByName(entryList, EVENT_NAME_STATE_APPLY);
      this.viewUpdated = this.getEntryByName(entryList, EVENT_NAME_UPDATE_STATE);
      this.onChangeCalled = this.getEntryByName(entryList, EVENT_NAME_ON_CHANGE);
      this.onEditorViewStateUpdatedCalled = this.getEntryByName(entryList, EVENT_NAME_VIEW_STATE_UPDATED);
      this.withPlugins(this.pluginNames);
      return this;
    }
  }, {
    key: "withPlugins",
    value: function withPlugins(pluginNames) {
      var _this2 = this;

      var emptyEntry = {
        duration: 0
      };
      this.pluginNames = pluginNames;
      this.plugins = pluginNames.reduce(function (acc, name) {
        var pluginApplied = _this2.entryList ? _this2.getEntryByName(_this2.entryList, "\uD83E\uDD89".concat(name, "::apply")) || emptyEntry : emptyEntry;
        var pluginViewUpdated = _this2.entryList ? _this2.getEntryByName(_this2.entryList, "\uD83E\uDD89".concat(name, "::view::update")) || emptyEntry : emptyEntry;
        var pluginOnEditorViewStateUpdated = _this2.entryList ? _this2.getEntryByName(_this2.entryList, "\uD83E\uDD89".concat(name, "::onEditorViewStateUpdated")) || emptyEntry : emptyEntry;
        acc[name] = {
          stateApply: pluginApplied.duration,
          viewUpdate: pluginViewUpdated.duration,
          onEditorViewStateUpdated: pluginOnEditorViewStateUpdated.duration
        };
        return acc;
      }, {});

      if (this.stateApplied && pluginNames.length > 0) {
        var pluginEntries = Object.entries(this.plugins);
        var stateApplyOutlier = outlier(pluginEntries.map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              stateApply = _ref2[1].stateApply;

          return stateApply;
        }), this.options.outlierFactor);
        var viewUpdateOutlier = outlier(pluginEntries.map(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              viewUpdate = _ref4[1].viewUpdate;

          return viewUpdate;
        }), this.options.outlierFactor);
        var budget = this.options.outlierThreshold / pluginEntries.length;
        /**
         * Consider plugin methods slow that are
         * statistically significantly slower than peers
         * AND where the sum of methods for a plugin is slower than 16.7ms / plugins.length
         */

        var pluginIsOutlier = function pluginIsOutlier(_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              methods = _ref6[1];

          return _this2.getMethodSum(methods) > budget && _this2.hasOutlierMethods(methods, {
            stateApplyOutlier: stateApplyOutlier,
            viewUpdateOutlier: viewUpdateOutlier
          });
        };

        this.slowPlugins = pluginEntries.filter(pluginIsOutlier).reduce(function (acc, _ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              n = _ref8[0],
              d = _ref8[1];

          return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, n, d));
        }, {});
      }

      return this;
    }
  }, {
    key: "withNodes",
    value: function withNodes(nodesCount) {
      var nodesDuration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.nodes = nodesCount.nodeCount;
      this.extensionNodes = nodesCount.extensionNodeCount;
      this.nodesDuration = nodesDuration;
      return this;
    }
  }, {
    key: "withCount",
    value: function withCount(count) {
      this.count = count;
      return this;
    }
  }, {
    key: "withOptions",
    value: function withOptions(options) {
      Object.assign(this.options, options);
      return this;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        trigger: this.trigger,
        duration: this.entry.duration,
        nodes: this.nodes,
        extensionNodes: this.extensionNodes,
        plugins: this.plugins,
        slowPlugins: this.slowPlugins,
        stepDurations: {
          stateApply: this.stateApplied ? this.stateApplied.duration : 0,
          viewUpdate: this.viewUpdated ? this.viewUpdated.duration : 0,
          onChange: this.onChangeCalled ? this.onChangeCalled.duration : 0,
          onEditorViewStateUpdated: this.onEditorViewStateUpdatedCalled ? this.onEditorViewStateUpdatedCalled.duration : 0,
          countNodes: this.nodesDuration
        }
      };
    }
  }], [{
    key: "fromEntry",
    value: function fromEntry(entry) {
      return new PluginPerformanceReport(entry);
    }
  }]);

  return PluginPerformanceReport;
}();