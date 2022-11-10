import type { FeatureFlags } from '../../types/feature-flags';
/**
 * Transforms FeatureFlags to a type safe string array of the enabled feature flags.
 *
 * Useful for analytics and analysis purposes.
 */
export declare function getEnabledFeatureFlagKeys(featureFlags: FeatureFlags): (keyof FeatureFlags)[];
