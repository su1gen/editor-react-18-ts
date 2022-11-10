import _defineProperty from "@babel/runtime/helpers/defineProperty";
import memoizeOne from 'memoize-one';
export class AnalyticsQueue {
  constructor() {
    _defineProperty(this, "tasks", []);

    _defineProperty(this, "running", false);
  }

  request(fn) {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(fn);
    } else {
      const start = performance.now();
      setTimeout(() => {
        fn({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50 - (performance.now() - start))
        });
      }, 0);
    }
  }

  pending() {
    var _window$navigator, _window$navigator$sch;

    // Defensive coding as navigator.scheduling.isInputPending is an experimental API
    if (typeof ((_window$navigator = window.navigator) === null || _window$navigator === void 0 ? void 0 : (_window$navigator$sch = _window$navigator.scheduling) === null || _window$navigator$sch === void 0 ? void 0 : _window$navigator$sch.isInputPending) === 'function') {
      var _window$navigator2, _window$navigator2$sc;

      return ((_window$navigator2 = window.navigator) === null || _window$navigator2 === void 0 ? void 0 : (_window$navigator2$sc = _window$navigator2.scheduling) === null || _window$navigator2$sc === void 0 ? void 0 : _window$navigator2$sc.isInputPending()) === true;
    }

    return false;
  }

  process() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.request(deadline => {
      while (deadline.timeRemaining() > 0 && this.tasks.length > 0 && !this.pending()) {
        const task = this.tasks.shift();

        if (task) {
          task();
        }
      }

      this.running = false;

      if (this.tasks.length > 0) {
        this.process();
      }
    });
  }

  schedule(task) {
    this.tasks.push(task);
    this.process();
  }

}

_defineProperty(AnalyticsQueue, "get", memoizeOne(() => new AnalyticsQueue()));