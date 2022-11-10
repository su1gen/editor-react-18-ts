import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { isPerformanceAPIAvailable, startMeasure, stopMeasure } from '@atlaskit/editor-common/utils';
import { getTimeSince } from './get-performance-timing';
export var EVENT_NAME_STATE_APPLY = "\uD83E\uDD89 EditorView::state::apply";
export var EVENT_NAME_UPDATE_STATE = "\uD83E\uDD89 EditorView::updateState";
export var EVENT_NAME_VIEW_STATE_UPDATED = "\uD83E\uDD89 EditorView::onEditorViewStateUpdated";
export var EVENT_NAME_ON_CHANGE = "\uD83E\uDD89 ReactEditorView::onChange";
export var EVENT_NAME_DISPATCH_TRANSACTION = "\uD83E\uDD89 ReactEditorView::dispatchTransaction";
export var DEFAULT_USE_PERFORMANCE_MARK = false;
var DEFAULT_SAMPLING_RATE = 100;

var noop = function noop() {};

export var TransactionTracker = /*#__PURE__*/function () {
  function TransactionTracker() {
    var _this = this;

    _classCallCheck(this, TransactionTracker);

    _defineProperty(this, "dispatchCallCounter", 0);

    _defineProperty(this, "measureMap", new Map());

    _defineProperty(this, "measureListeners", []);

    _defineProperty(this, "bumpDispatchCounter", function (options) {
      var trackingEnabled = options.enabled,
          _options$samplingRate = options.samplingRate,
          samplingRate = _options$samplingRate === void 0 ? DEFAULT_SAMPLING_RATE : _options$samplingRate;

      if (trackingEnabled) {
        if (_this.dispatchCallCounter >= samplingRate) {
          _this.dispatchCallCounter = 0;
        }

        _this.dispatchCallCounter++;
      }

      return _this.dispatchCallCounter;
    });

    _defineProperty(this, "getMeasureHelpers", function (options) {
      var _options$usePerforman = options.usePerformanceMarks,
          usePerformanceMarks = _options$usePerforman === void 0 ? DEFAULT_USE_PERFORMANCE_MARK : _options$usePerforman;

      if (!_this.shouldTrackTransaction(options)) {
        return {
          startMeasure: noop,
          stopMeasure: noop
        };
      }

      return {
        startMeasure: usePerformanceMarks ? startMeasure : _this.startMeasureSimple,
        stopMeasure: usePerformanceMarks ? stopMeasure : _this.stopMeasureSimple
      };
    });

    _defineProperty(this, "startMeasureSimple", function (measureName) {
      if (!isPerformanceAPIAvailable()) {
        return;
      }

      _this.measureMap.set(measureName, performance.now());
    });

    _defineProperty(this, "stopMeasureSimple", function (measureName, onMeasureComplete) {
      if (!isPerformanceAPIAvailable()) {
        return;
      }

      var startTime = _this.measureMap.get(measureName);

      if (startTime) {
        var _duration = getTimeSince(startTime);

        _this.measureMap.delete(measureName);

        if (onMeasureComplete) {
          onMeasureComplete(_duration, startTime);
        } // Call each subscribed listener


        _this.measureListeners.forEach(function (listener) {
          return listener({
            name: measureName,
            duration: _duration,
            startTime: startTime
          });
        });
      }
    });
  }

  _createClass(TransactionTracker, [{
    key: "addMeasureListener",
    value: function addMeasureListener(listener) {
      this.measureListeners.push(listener);
    }
  }, {
    key: "removeMeasureListener",
    value: function removeMeasureListener(listener) {
      var index = this.measureListeners.indexOf(listener);

      if (index > -1) {
        this.measureListeners.splice(index, 1);
      }
    }
  }, {
    key: "shouldTrackTransaction",
    value: function shouldTrackTransaction(options) {
      var trackingEnabled = options.enabled,
          _options$samplingRate2 = options.samplingRate,
          samplingRate = _options$samplingRate2 === void 0 ? DEFAULT_SAMPLING_RATE : _options$samplingRate2;
      return trackingEnabled && this.dispatchCallCounter === samplingRate;
    }
  }]);

  return TransactionTracker;
}();