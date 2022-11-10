"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeSince = void 0;

/**
 * Calculate the difference between performance.now() and the given startTime.
 * This allows for the timing to be overridable during tests.
 *
 * @param startTime DOMHighResTimeStamp
 * @returns DOMHighResTimeStamp
 */
var getTimeSince = function getTimeSince(startTime) {
  return performance.now() - startTime;
};

exports.getTimeSince = getTimeSince;