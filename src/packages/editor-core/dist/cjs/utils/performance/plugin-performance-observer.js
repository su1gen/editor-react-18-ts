"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginPerformanceObserver = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pluginPerformanceReport = require("./plugin-performance-report");

var _trackTransactions = require("./track-transactions");

var _simpleMeasureToEntries = require("./simple-measure-to-entries");

var PluginPerformanceObserver = /*#__PURE__*/function () {
  function PluginPerformanceObserver(callback) {
    var _this = this;

    (0, _classCallCheck2.default)(this, PluginPerformanceObserver);
    (0, _defineProperty2.default)(this, "getNodeCounts", function () {
      return [{
        nodeCount: {},
        extensionNodeCount: {}
      }, 0];
    });
    (0, _defineProperty2.default)(this, "getPlugins", function () {
      return [];
    });
    (0, _defineProperty2.default)(this, "getOptions", function () {
      return {};
    });
    (0, _defineProperty2.default)(this, "reportCount", 0);
    (0, _defineProperty2.default)(this, "simpleObserver", new _simpleMeasureToEntries.SimpleMeasurementLogger());
    (0, _defineProperty2.default)(this, "onObserveration", function (entries) {
      var reports = entries.getEntriesByName(_trackTransactions.EVENT_NAME_DISPATCH_TRANSACTION).map(function (entry) {
        var _PluginPerformanceRep;

        return (_PluginPerformanceRep = _pluginPerformanceReport.PluginPerformanceReport.fromEntry(entry).withCount(++_this.reportCount).withEntryList(entries)).withNodes.apply(_PluginPerformanceRep, (0, _toConsumableArray2.default)(_this.getNodeCounts())).withPlugins(_this.getPlugins()).withOptions(_this.getOptions()).toJSON();
      });
      reports.filter(function (report) {
        return report.trigger !== 'none';
      }).forEach(function (report) {
        return _this.callback(report);
      });
    });
    this.callback = callback;
    this.observer = window.PerformanceObserver ? new PerformanceObserver(this.onObserveration) : {
      observe: function observe() {},
      disconnect: function disconnect() {},
      takeRecords: function takeRecords() {
        return [];
      }
    };
  }

  (0, _createClass2.default)(PluginPerformanceObserver, [{
    key: "isSimpleTracking",
    get: function get() {
      var _this$getOptions = this.getOptions(),
          _this$getOptions$useP = _this$getOptions.usePerformanceMarks,
          usePerformanceMarks = _this$getOptions$useP === void 0 ? _trackTransactions.DEFAULT_USE_PERFORMANCE_MARK : _this$getOptions$useP;

      return !usePerformanceMarks;
    }
  }, {
    key: "withNodeCounts",
    value: function withNodeCounts(getNodeCounts) {
      this.getNodeCounts = function () {
        var start = performance.now();
        var result = getNodeCounts();
        return [result, performance.now() - start];
      };

      return this;
    }
  }, {
    key: "withPlugins",
    value: function withPlugins(getPlugins) {
      this.getPlugins = getPlugins;
      return this;
    }
  }, {
    key: "withOptions",
    value: function withOptions(getOptions) {
      this.getOptions = getOptions;
      return this;
    }
  }, {
    key: "withTransactionTracker",
    value: function withTransactionTracker(getTransactionTracker) {
      this.getTransactionTracker = getTransactionTracker;
      return this;
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      if (this.isSimpleTracking) {
        this.simpleObserver.setPluginNames(this.getPlugins());
        this.simpleObserver.setOnObservation(function (entries) {
          _this2.onObserveration(entries, _this2.observer);
        }); // can trigger a callback when stopMeasure() measures something.
        // use that to trigger this.onObservation()

        this.getTransactionTracker && this.getTransactionTracker().addMeasureListener(this.simpleObserver.observed);
      } else {
        try {
          this.observer.observe({
            buffered: false,
            type: 'measure'
          });
        } catch (err) {
          // Older API implementations do not support the simpler type init
          this.observer.observe({
            entryTypes: ['measure']
          });
        }
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this.isSimpleTracking) {
        this.getTransactionTracker && this.getTransactionTracker().removeMeasureListener(this.simpleObserver.observed);
      } else {
        this.observer.disconnect();
      }
    }
  }, {
    key: "takeRecords",
    value: function takeRecords() {
      return this.observer.takeRecords();
    }
  }]);
  return PluginPerformanceObserver;
}();

exports.PluginPerformanceObserver = PluginPerformanceObserver;