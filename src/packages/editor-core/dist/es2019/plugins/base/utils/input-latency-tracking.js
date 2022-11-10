import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { getTimeSince } from '../../../utils/performance/get-performance-timing';
import { getAnalyticsEventSeverity } from '@atlaskit/editor-common/utils';
export default class InputLatencyTracker {
  constructor({
    samplingRate,
    slowThreshold,
    normalThreshold,
    degradedThreshold,
    dispatchAverage,
    dispatchSample,
    onSampleStart,
    onSampleEnd,
    onSlowInput
  }) {
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

  start() {
    this.currentStart = performance.now();

    if (this.samples.length + 1 === this.samplingRate) {
      var _this$onSampleStart;

      (_this$onSampleStart = this.onSampleStart) === null || _this$onSampleStart === void 0 ? void 0 : _this$onSampleStart.call(this);
    }
  }

  end() {
    if (this.currentStart === null) {
      return;
    }

    let isSlow = false;
    const time = getTimeSince(this.currentStart);
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
        isSlow,
        severity: this.severity(time)
      });
    }
  }

  flush() {
    if (this.samples.length === 0) {
      return;
    }

    this.dispatch();
    this.samples = [];
    this.total = 0;
  }

  dispatch() {
    var _this$dispatchSample, _this$dispatchAverage;

    (_this$dispatchSample = this.dispatchSample) === null || _this$dispatchSample === void 0 ? void 0 : _this$dispatchSample.call(this, this.getLast(), this.severity(this.getLast())); // cache

    const median = this.getMedian();
    (_this$dispatchAverage = this.dispatchAverage) === null || _this$dispatchAverage === void 0 ? void 0 : _this$dispatchAverage.call(this, {
      mean: this.getMean(),
      median,
      sampleSize: this.samples.length
    }, this.severity(median));
  }

  push(latency) {
    this.samples.push(latency);
    this.total += latency;
  }

  severity(time) {
    return getAnalyticsEventSeverity(time, this.normalThreshold, this.degradedThreshold);
  }

  getLast() {
    return this.samples[this.samples.length - 1];
  }

  getMean() {
    return this.total / this.samples.length;
  }

  getMedian() {
    if (this.samples.length === 1) {
      return this.samples[0];
    }

    this.samples.sort((a, b) => a - b);
    const middle = (this.samples.length + 1) / 2;
    const floorMiddle = Math.floor(middle);
    const remainder = middle % floorMiddle;

    if (remainder === 0) {
      return this.samples[middle - 1];
    }

    const left = this.samples[floorMiddle - 1];
    const right = this.samples[floorMiddle];
    return (left + right) / 2;
  }

}