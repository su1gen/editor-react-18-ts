import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { PluginPerformanceReport } from './plugin-performance-report';
import { DEFAULT_USE_PERFORMANCE_MARK, EVENT_NAME_DISPATCH_TRANSACTION } from './track-transactions';
import { SimpleMeasurementLogger } from './simple-measure-to-entries';
export var PluginPerformanceObserver = /*#__PURE__*/function () {
  function PluginPerformanceObserver(callback) {
    var _this = this;

    _classCallCheck(this, PluginPerformanceObserver);

    _defineProperty(this, "getNodeCounts", function () {
      return [{
        nodeCount: {},
        extensionNodeCount: {}
      }, 0];
    });

    _defineProperty(this, "getPlugins", function () {
      return [];
    });

    _defineProperty(this, "getOptions", function () {
      return {};
    });

    _defineProperty(this, "reportCount", 0);

    _defineProperty(this, "simpleObserver", new SimpleMeasurementLogger());

    _defineProperty(this, "onObserveration", function (entries) {
      var reports = entries.getEntriesByName(EVENT_NAME_DISPATCH_TRANSACTION).map(function (entry) {
        var _PluginPerformanceRep;

        return (_PluginPerformanceRep = PluginPerformanceReport.fromEntry(entry).withCount(++_this.reportCount).withEntryList(entries)).withNodes.apply(_PluginPerformanceRep, _toConsumableArray(_this.getNodeCounts())).withPlugins(_this.getPlugins()).withOptions(_this.getOptions()).toJSON();
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

  _createClass(PluginPerformanceObserver, [{
    key: "isSimpleTracking",
    get: function get() {
      var _this$getOptions = this.getOptions(),
          _this$getOptions$useP = _this$getOptions.usePerformanceMarks,
          usePerformanceMarks = _this$getOptions$useP === void 0 ? DEFAULT_USE_PERFORMANCE_MARK : _this$getOptions$useP;

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