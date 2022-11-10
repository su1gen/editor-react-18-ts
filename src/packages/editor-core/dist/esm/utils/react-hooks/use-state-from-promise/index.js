import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useState, useCallback } from 'react';
import { useAbortableEffect } from '../use-abortable-effect';

/**
 * Similar to useState but deals with async values.
 * Simply pass a promise and it will set the state when it resolves. It won't try to set if
 * the component unmounts
 *
 * Note: This hook follows the signature of useEffect so it can be linted if enabled through the
 * `additionalHooks` config.
 *
 * @param callback
 * @param deps
 */
export function useStateFromPromise(callback, deps, initialValue) {
  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  var fn = useCallback(callback, deps);

  var _useState = useState(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  useAbortableEffect(function (signal) {
    Promise.resolve(fn()).then(function (result) {
      if (signal.aborted) {
        return;
      }

      setValue(result);
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  _toConsumableArray(deps));
  return [value, setValue];
}