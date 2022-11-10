import { EditorState } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import type { FeatureFlags } from '../../types/feature-flags';
declare const featureFlagsContextPlugin: (featureFlags?: FeatureFlags) => EditorPlugin;
export declare const getFeatureFlags: (state: EditorState) => FeatureFlags;
export declare const useFeatureFlags: () => FeatureFlags | undefined;
export default featureFlagsContextPlugin;
