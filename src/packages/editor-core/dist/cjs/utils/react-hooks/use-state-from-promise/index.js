"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStateFromPromise = useStateFromPromise;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _useAbortableEffect = require("../use-abortable-effect");

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
function useStateFromPromise(callback, deps, initialValue) {
  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  var fn = (0, _react.useCallback)(callback, deps);

  var _useState = (0, _react.useState)(initialValue),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  (0, _useAbortableEffect.useAbortableEffect)(function (signal) {
    Promise.resolve(fn()).then(function (result) {
      if (signal.aborted) {
        return;
      }

      setValue(result);
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  (0, _toConsumableArray2.default)(deps));
  return [value, setValue];
}