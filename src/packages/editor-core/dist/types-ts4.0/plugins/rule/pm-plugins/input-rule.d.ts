import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, Transaction } from 'prosemirror-state';
import { FeatureFlags } from '../../../types/feature-flags';
import { INPUT_METHOD } from '../../analytics';
export declare const createHorizontalRule: (state: EditorState, start: number, end: number, inputMethod: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR | INPUT_METHOD.INSERT_MENU | INPUT_METHOD.FORMATTING | INPUT_METHOD.SHORTCUT) => Transaction<any> | null;
export declare function inputRulePlugin(schema: Schema, featureFlags: FeatureFlags): SafePlugin | undefined;
export default inputRulePlugin;
