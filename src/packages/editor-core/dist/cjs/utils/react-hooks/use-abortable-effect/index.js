"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAbortableEffect = useAbortableEffect;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = require("react");

var safeError = function safeError(message) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(message);
  } // eslint-disable-next-line no-console


  console.error(message);
};

var createAbortController = function createAbortController() {
  if (typeof AbortController === 'undefined') {
    safeError('Missing AbortController');
  }

  return new AbortController();
};

/**
 * Similar to useEffect but integrated with the AbortController to make it useful for async operations.
 * On unmount, the abort function will be called and the signal will be passed down to the function so
 * we get the chance to cancel any operation we want.
 *
 * Note: This hook follows the signature of useEffect so it can be linted if enabled through the
 * `additionalHooks` config.
 *
 * @param callback
 * @param deps
 */
function useAbortableEffect(callback, deps) {
  var abortController = (0, _react.useMemo)(function () {
    return createAbortController();
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  deps);
  var abort = (0, _react.useCallback)(function () {
    return abortController.abort();
  }, [abortController]); // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps

  var fn = (0, _react.useCallback)(callback, deps);
  (0, _react.useEffect)(function () {
    var teardown = fn(abortController.signal);
    return function () {
      if (typeof teardown === 'function') {
        teardown();
      }

      abort();
    };
  }, [abortController, abort, fn].concat((0, _toConsumableArray2.default)(deps)));
}