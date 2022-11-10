"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnabledFeatureFlagKeys = getEnabledFeatureFlagKeys;

/**
 * Transforms FeatureFlags to a type safe string array of the enabled feature flags.
 *
 * Useful for analytics and analysis purposes.
 */
function getEnabledFeatureFlagKeys(featureFlags) {
  return Object.keys(featureFlags).filter(function (key) {
    return featureFlags[key] === true;
  });
}