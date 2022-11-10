/**
 * Transforms FeatureFlags to a type safe string array of the enabled feature flags.
 *
 * Useful for analytics and analysis purposes.
 */
export function getEnabledFeatureFlagKeys(featureFlags) {
  return Object.keys(featureFlags).filter(key => featureFlags[key] === true);
}