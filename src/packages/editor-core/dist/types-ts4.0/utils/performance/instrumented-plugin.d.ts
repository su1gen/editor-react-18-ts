import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { SafePluginSpec } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { EditorProps } from '../../types/editor-props';
import { TransactionTracker } from './track-transactions';
import { FeatureFlags } from '../../types/feature-flags';
import { DispatchAnalyticsEvent } from '../../plugins/analytics/types';
declare type InstrumentedPluginOptions = EditorProps['performanceTracking'] & {
    saferDispatchedTransactions?: FeatureFlags['saferDispatchedTransactions'];
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};
export declare class InstrumentedPlugin<PluginState, NodeSchema extends Schema<any, any>> extends SafePlugin<PluginState, NodeSchema> {
    constructor(spec: SafePluginSpec, options?: InstrumentedPluginOptions, transactionTracker?: TransactionTracker);
    static fromPlugin<T, V extends Schema<any, any>>(plugin: SafePlugin<T, V>, options: InstrumentedPluginOptions, transactionTracker?: TransactionTracker): InstrumentedPlugin<T, V>;
}
export {};
