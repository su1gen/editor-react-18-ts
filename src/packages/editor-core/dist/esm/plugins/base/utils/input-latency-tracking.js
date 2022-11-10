import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { getTimeSince } from '../../../utils/performance/get-performance-timing';
import { getAnalyticsEventSeverity } from '@atlaskit/editor-common/utils';

var InputLatencyTracker = /*#__PURE__*/function () {
  function InputLatencyTracker(_ref) {
    var samplingRate = _ref.samplingRate,
        slowThreshold = _ref.slowThreshold,
        normalThreshold = _ref.normalThreshold,
        degradedThreshold = _ref.degradedThreshold,
        dispatchAverage = _ref.dispatchAverage,
        dispatchSample = _ref.dispatchSample,
        onSampleStart = _ref.onSampleStart,
        onSampleEnd = _ref.onSampleEnd,
        onSlowInput = _ref.onSlowInput;

    _classCallCheck(this, InputLatencyTracker);

    _defineProperty(this, "samples", []);

    _defineProperty(this, "total", 0);

    this.currentStart = null;
    this.samplingRate = samplingRate;
    this.slowThreshold = slowThreshold;
    this.normalThreshold = normalThreshold;
    this.degradedThreshold = degradedThreshold;
    this.dispatchAverage = dispatchAverage;
    this.dispatchSample = dispatchSample;
    this.onSampleStart = onSampleStart;
    this.onSampleEnd = onSampleEnd;
    this.onSlowInput = onSlowInput;
  }

  _createClass(InputLatencyTracker, [{
    key: "start",
    value: function start() {
      this.currentStart = performance.now();

      if (this.samples.length + 1 === this.samplingRate) {
        var _this$onSampleStart;

        (_this$onSampleStart = this.onSampleStart) === null || _this$onSampleStart === void 0 ? void 0 : _this$onSampleStart.call(this);
      }
    }
  }, {
    key: "end",
    value: function end() {
      if (this.currentStart === null) {
        return;
      }

      var isSlow = false;
      var time = getTimeSince(this.currentStart);
      this.push(time);

      if (time > this.slowThreshold) {
        var _this$onSlowInput;

        (_this$onSlowInput = this.onSlowInput) === null || _this$onSlowInput === void 0 ? void 0 : _this$onSlowInput.call(this, time);
        isSlow = true;
      }

      if (this.samples.length === this.samplingRate) {
        var _this$onSampleEnd;

        this.flush();
        (_this$onSampleEnd = this.onSampleEnd) === null || _this$onSampleEnd === void 0 ? void 0 : _this$onSampleEnd.call(this, time, {
          isSlow: isSlow,
          severity: this.severity(time)
        });
      }
    }
  }, {
    key: "flush",
    value: function flush() {
      if (this.samples.length === 0) {
        return;
      }

      this.dispatch();
      this.samples = [];
      this.total = 0;
    }
  }, {
    key: "dispatch",
    value: function dispatch() {
      var _this$dispatchSample, _this$dispatchAverage;

      (_this$dispatchSample = this.dispatchSample) === null || _this$dispatchSample === void 0 ? void 0 : _this$dispatchSample.call(this, this.getLast(), this.severity(this.getLast())); // cache

      var median = this.getMedian();
      (_this$dispatchAverage = this.dispatchAverage) === null || _this$dispatchAverage === void 0 ? void 0 : _this$dispatchAverage.call(this, {
        mean: this.getMean(),
        median: median,
        sampleSize: this.samples.length
      }, this.severity(median));
    }
  }, {
    key: "push",
    value: function push(latency) {
      this.samples.push(latency);
      this.total += latency;
    }
  }, {
    key: "severity",
    value: function severity(time) {
      return getAnalyticsEventSeverity(time, this.normalThreshold, this.degradedThreshold);
    }
  }, {
    key: "getLast",
    value: function getLast() {
      return this.samples[this.samples.length - 1];
    }
  }, {
    key: "getMean",
    value: function getMean() {
      return this.total / this.samples.length;
    }
  }, {
    key: "getMedian",
    value: function getMedian() {
      if (this.samples.length === 1) {
        return this.samples[0];
      }

      this.samples.sort(function (a, b) {
        return a - b;
      });
      var middle = (this.samples.length + 1) / 2;
      var floorMiddle = Math.floor(middle);
      var remainder = middle % floorMiddle;

      if (remainder === 0) {
        return this.samples[middle - 1];
      }

      var left = this.samples[floorMiddle - 1];
      var right = this.samples[floorMiddle];
      return (left + right) / 2;
    }
  }]);

  return InputLatencyTracker;
}();

export { InputLatencyTracker as default };