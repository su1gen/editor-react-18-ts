import { DispatchAnalyticsEvent } from '../../plugins/analytics/types';
export declare const UNSAFE_PROPERTY_SET_ERROR = "Setting an unsafe property on transaction after dispatch!";
interface FreezeUnsafeTransactionOptions {
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    pluginKey?: string;
}
export declare const freezeUnsafeTransactionProperties: <TrType extends object>({ dispatchAnalyticsEvent, pluginKey, }: FreezeUnsafeTransactionOptions) => ProxyHandler<TrType>;
export {};
