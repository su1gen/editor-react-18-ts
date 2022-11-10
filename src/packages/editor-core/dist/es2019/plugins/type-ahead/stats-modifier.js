import _defineProperty from "@babel/runtime/helpers/defineProperty";
export class StatsModifier {
  constructor() {
    _defineProperty(this, "startedAt", 0);

    _defineProperty(this, "endedAt", 0);

    _defineProperty(this, "keyCount", {
      arrowUp: 0,
      arrowDown: 0
    });

    _defineProperty(this, "increaseArrowUp", () => {
      this.keyCount.arrowUp += 1;
    });

    _defineProperty(this, "increaseArrowDown", () => {
      this.keyCount.arrowDown += 1;
    });

    _defineProperty(this, "serialize", () => {
      var _this$keyCount, _this$keyCount2;

      return {
        startedAt: this.startedAt,
        endedAt: performance.now(),
        keyCount: {
          arrowUp: ((_this$keyCount = this.keyCount) === null || _this$keyCount === void 0 ? void 0 : _this$keyCount.arrowUp) || 0,
          arrowDown: ((_this$keyCount2 = this.keyCount) === null || _this$keyCount2 === void 0 ? void 0 : _this$keyCount2.arrowDown) || 0
        }
      };
    });

    this.startedAt = performance.now();
    this.keyCount = {
      arrowUp: 0,
      arrowDown: 0
    };
  }

}