"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatsModifier = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var StatsModifier = /*#__PURE__*/(0, _createClass2.default)(function StatsModifier() {
  var _this = this;

  (0, _classCallCheck2.default)(this, StatsModifier);
  (0, _defineProperty2.default)(this, "startedAt", 0);
  (0, _defineProperty2.default)(this, "endedAt", 0);
  (0, _defineProperty2.default)(this, "keyCount", {
    arrowUp: 0,
    arrowDown: 0
  });
  (0, _defineProperty2.default)(this, "increaseArrowUp", function () {
    _this.keyCount.arrowUp += 1;
  });
  (0, _defineProperty2.default)(this, "increaseArrowDown", function () {
    _this.keyCount.arrowDown += 1;
  });
  (0, _defineProperty2.default)(this, "serialize", function () {
    var _this$keyCount, _this$keyCount2;

    return {
      startedAt: _this.startedAt,
      endedAt: performance.now(),
      keyCount: {
        arrowUp: ((_this$keyCount = _this.keyCount) === null || _this$keyCount === void 0 ? void 0 : _this$keyCount.arrowUp) || 0,
        arrowDown: ((_this$keyCount2 = _this.keyCount) === null || _this$keyCount2 === void 0 ? void 0 : _this$keyCount2.arrowDown) || 0
      }
    };
  });
  this.startedAt = performance.now();
  this.keyCount = {
    arrowUp: 0,
    arrowDown: 0
  };
});
exports.StatsModifier = StatsModifier;