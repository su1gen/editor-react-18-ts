"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaTaskManager = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var MediaTaskManager = /*#__PURE__*/(0, _createClass2.default)(function MediaTaskManager() {
  var _this = this;

  (0, _classCallCheck2.default)(this, MediaTaskManager);
  (0, _defineProperty2.default)(this, "pendingTask", Promise.resolve(null));
  (0, _defineProperty2.default)(this, "taskMap", new Map());
  (0, _defineProperty2.default)(this, "cancelPendingTask", function (id) {
    var task = _this.taskMap.get(id);

    if (task && !task.cancelController.signal.aborted) {
      task.cancelController.abort();
    }
  });
  (0, _defineProperty2.default)(this, "waitForPendingTasks", /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(timeout, lastTask) {
      var chainedPromise, rejectTimeout, timeoutPromise;
      return _regenerator.default.wrap(function _callee$(_context) {
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
  (0, _defineProperty2.default)(this, "resumePendingTask", function (id) {
    var mediaTask = _this.taskMap.get(id);

    if (mediaTask && mediaTask.cancelController.signal.aborted) {
      _this.addPendingTask(mediaTask.task, id);
    }
  });
  (0, _defineProperty2.default)(this, "addPendingTask", function (task, id) {
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
exports.MediaTaskManager = MediaTaskManager;