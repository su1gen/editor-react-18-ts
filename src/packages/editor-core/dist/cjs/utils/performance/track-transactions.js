"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransactionTracker = exports.EVENT_NAME_VIEW_STATE_UPDATED = exports.EVENT_NAME_UPDATE_STATE = exports.EVENT_NAME_STATE_APPLY = exports.EVENT_NAME_ON_CHANGE = exports.EVENT_NAME_DISPATCH_TRANSACTION = exports.DEFAULT_USE_PERFORMANCE_MARK = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("@atlaskit/editor-common/utils");

var _getPerformanceTiming = require("./get-performance-timing");

var EVENT_NAME_STATE_APPLY = "\uD83E\uDD89 EditorView::state::apply";
exports.EVENT_NAME_STATE_APPLY = EVENT_NAME_STATE_APPLY;
var EVENT_NAME_UPDATE_STATE = "\uD83E\uDD89 EditorView::updateState";
exports.EVENT_NAME_UPDATE_STATE = EVENT_NAME_UPDATE_STATE;
var EVENT_NAME_VIEW_STATE_UPDATED = "\uD83E\uDD89 EditorView::onEditorViewStateUpdated";
exports.EVENT_NAME_VIEW_STATE_UPDATED = EVENT_NAME_VIEW_STATE_UPDATED;
var EVENT_NAME_ON_CHANGE = "\uD83E\uDD89 ReactEditorView::onChange";
exports.EVENT_NAME_ON_CHANGE = EVENT_NAME_ON_CHANGE;
var EVENT_NAME_DISPATCH_TRANSACTION = "\uD83E\uDD89 ReactEditorView::dispatchTransaction";
exports.EVENT_NAME_DISPATCH_TRANSACTION = EVENT_NAME_DISPATCH_TRANSACTION;
var DEFAULT_USE_PERFORMANCE_MARK = false;
exports.DEFAULT_USE_PERFORMANCE_MARK = DEFAULT_USE_PERFORMANCE_MARK;
var DEFAULT_SAMPLING_RATE = 100;

var noop = function noop() {};

var TransactionTracker = /*#__PURE__*/function () {
  function TransactionTracker() {
    var _this = this;

    (0, _classCallCheck2.default)(this, TransactionTracker);
    (0, _defineProperty2.default)(this, "dispatchCallCounter", 0);
    (0, _defineProperty2.default)(this, "measureMap", new Map());
    (0, _defineProperty2.default)(this, "measureListeners", []);
    (0, _defineProperty2.default)(this, "bumpDispatchCounter", function (options) {
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
    (0, _defineProperty2.default)(this, "getMeasureHelpers", function (options) {
      var _options$usePerforman = options.usePerformanceMarks,
          usePerformanceMarks = _options$usePerforman === void 0 ? DEFAULT_USE_PERFORMANCE_MARK : _options$usePerforman;

      if (!_this.shouldTrackTransaction(options)) {
        return {
          startMeasure: noop,
          stopMeasure: noop
        };
      }

      return {
        startMeasure: usePerformanceMarks ? _utils.startMeasure : _this.startMeasureSimple,
        stopMeasure: usePerformanceMarks ? _utils.stopMeasure : _this.stopMeasureSimple
      };
    });
    (0, _defineProperty2.default)(this, "startMeasureSimple", function (measureName) {
      if (!(0, _utils.isPerformanceAPIAvailable)()) {
        return;
      }

      _this.measureMap.set(measureName, performance.now());
    });
    (0, _defineProperty2.default)(this, "stopMeasureSimple", function (measureName, onMeasureComplete) {
      if (!(0, _utils.isPerformanceAPIAvailable)()) {
        return;
      }

      var startTime = _this.measureMap.get(measureName);

      if (startTime) {
        var _duration = (0, _getPerformanceTiming.getTimeSince)(startTime);

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

  (0, _createClass2.default)(TransactionTracker, [{
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

exports.TransactionTracker = TransactionTracker;