import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { FeatureFlags } from '../../../types/feature-flags';
export default function keymapPlugin(schema: Schema, featureFlags: FeatureFlags): SafePlugin;
