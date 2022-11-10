import { EditorProps } from '../../types';
import type { FeatureFlags } from '../../types/feature-flags';
/**
 * Transforms EditorProps to an FeatureFlags object,
 * which is used by both current and archv3 editors.
 */
export declare function createFeatureFlagsFromProps(props: EditorProps): FeatureFlags;
