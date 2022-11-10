"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnalyticsQueue = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var AnalyticsQueue = /*#__PURE__*/function () {
  function AnalyticsQueue() {
    (0, _classCallCheck2.default)(this, AnalyticsQueue);
    (0, _defineProperty2.default)(this, "tasks", []);
    (0, _defineProperty2.default)(this, "running", false);
  }

  (0, _createClass2.default)(AnalyticsQueue, [{
    key: "request",
    value: function request(fn) {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(fn);
      } else {
        var start = performance.now();
        setTimeout(function () {
          fn({
            didTimeout: false,
            timeRemaining: function timeRemaining() {
              return Math.max(0, 50 - (performance.now() - start));
            }
          });
        }, 0);
      }
    }
  }, {
    key: "pending",
    value: function pending() {
      var _window$navigator, _window$navigator$sch;

      // Defensive coding as navigator.scheduling.isInputPending is an experimental API
      if (typeof ((_window$navigator = window.navigator) === null || _window$navigator === void 0 ? void 0 : (_window$navigator$sch = _window$navigator.scheduling) === null || _window$navigator$sch === void 0 ? void 0 : _window$navigator$sch.isInputPending) === 'function') {
        var _window$navigator2, _window$navigator2$sc;

        return ((_window$navigator2 = window.navigator) === null || _window$navigator2 === void 0 ? void 0 : (_window$navigator2$sc = _window$navigator2.scheduling) === null || _window$navigator2$sc === void 0 ? void 0 : _window$navigator2$sc.isInputPending()) === true;
      }

      return false;
    }
  }, {
    key: "process",
    value: function process() {
      var _this = this;

      if (this.running) {
        return;
      }

      this.running = true;
      this.request(function (deadline) {
        while (deadline.timeRemaining() > 0 && _this.tasks.length > 0 && !_this.pending()) {
          var task = _this.tasks.shift();

          if (task) {
            task();
          }
        }

        _this.running = false;

        if (_this.tasks.length > 0) {
          _this.process();
        }
      });
    }
  }, {
    key: "schedule",
    value: function schedule(task) {
      this.tasks.push(task);
      this.process();
    }
  }]);
  return AnalyticsQueue;
}();

exports.AnalyticsQueue = AnalyticsQueue;
(0, _defineProperty2.default)(AnalyticsQueue, "get", (0, _memoizeOne.default)(function () {
  return new AnalyticsQueue();
}));