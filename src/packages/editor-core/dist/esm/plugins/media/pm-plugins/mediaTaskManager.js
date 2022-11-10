import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
export var MediaTaskManager = /*#__PURE__*/_createClass(function MediaTaskManager() {
  var _this = this;

  _classCallCheck(this, MediaTaskManager);

  _defineProperty(this, "pendingTask", Promise.resolve(null));

  _defineProperty(this, "taskMap", new Map());

  _defineProperty(this, "cancelPendingTask", function (id) {
    var task = _this.taskMap.get(id);

    if (task && !task.cancelController.signal.aborted) {
      task.cancelController.abort();
    }
  });

  _defineProperty(this, "waitForPendingTasks", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(timeout, lastTask) {
      var chainedPromise, rejectTimeout, timeoutPromise;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(lastTask && _this.pendingTask === lastTask)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", lastTask);

            case 2:
              chainedPromise = _this.pendingTask.then(function () {
                return (// Call ourselves to make sure that no new pending tasks have been
                  // added before the current promise has resolved.
                  _this.waitForPendingTasks(undefined, _this.pendingTask)
                );
              });

              if (timeout) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", chainedPromise);

            case 5:
              timeoutPromise = new Promise(function (_resolve, reject) {
                rejectTimeout = window.setTimeout(function () {
                  return reject(new Error("Media operations did not finish in ".concat(timeout, " ms")));
                }, timeout);
              });
              return _context.abrupt("return", Promise.race([timeoutPromise, chainedPromise.then(function (value) {
                clearTimeout(rejectTimeout);
                return value;
              })]));

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  _defineProperty(this, "resumePendingTask", function (id) {
    var mediaTask = _this.taskMap.get(id);

    if (mediaTask && mediaTask.cancelController.signal.aborted) {
      _this.addPendingTask(mediaTask.task, id);
    }
  });

  _defineProperty(this, "addPendingTask", function (task, id) {
    var currentTask = task;

    if (id) {
      var cancelController = new AbortController();
      var signal = cancelController.signal;

      _this.taskMap.set(id, {
        task: task,
        cancelController: cancelController
      });

      currentTask = new Promise(function (resolve) {
        task.then(resolve, resolve).finally(function () {
          _this.taskMap.delete(id);
        });

        signal.onabort = function () {
          resolve(null);
        };
      });
    } // Chain the previous promise with a new one for this media item


    var currentPendingTask = _this.pendingTask;

    var pendingPromise = function pendingPromise() {
      return currentPendingTask;
    };

    _this.pendingTask = currentTask.then(pendingPromise, pendingPromise);
    return _this.pendingTask;
  });
});