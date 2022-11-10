import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { useEffect, useMemo, useCallback } from 'react';

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
export function useAbortableEffect(callback, deps) {
  var abortController = useMemo(function () {
    return createAbortController();
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  deps);
  var abort = useCallback(function () {
    return abortController.abort();
  }, [abortController]); // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps

  var fn = useCallback(callback, deps);
  useEffect(function () {
    var teardown = fn(abortController.signal);
    return function () {
      if (typeof teardown === 'function') {
        teardown();
      }

      abort();
    };
  }, [abortController, abort, fn].concat(_toConsumableArray(deps)));
}