import { AnalyticsEventPayload } from './types';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
export declare type FireAnalyticsCallback = <T>(payload: FireAnalyticsEventPayload<T>) => void | undefined;
export declare type FireAnalyticsEvent = (createAnalyticsEvent?: CreateUIAnalyticsEvent) => FireAnalyticsCallback;
export declare type FireAnalyticsEventPayload<T = void> = {
    payload: AnalyticsEventPayload<T>;
    channel?: string;
};
export declare const fireAnalyticsEvent: FireAnalyticsEvent;
