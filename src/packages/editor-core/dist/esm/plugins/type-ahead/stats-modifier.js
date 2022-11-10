import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
export var StatsModifier = /*#__PURE__*/_createClass(function StatsModifier() {
  var _this = this;

  _classCallCheck(this, StatsModifier);

  _defineProperty(this, "startedAt", 0);

  _defineProperty(this, "endedAt", 0);

  _defineProperty(this, "keyCount", {
    arrowUp: 0,
    arrowDown: 0
  });

  _defineProperty(this, "increaseArrowUp", function () {
    _this.keyCount.arrowUp += 1;
  });

  _defineProperty(this, "increaseArrowDown", function () {
    _this.keyCount.arrowDown += 1;
  });

  _defineProperty(this, "serialize", function () {
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