import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorPlugin } from '../../types/editor-plugin';
import { AnalyticsEventPayload } from './types';
import { PerformanceTracking } from '../../types/performance-tracking';
interface AnalyticsPluginOptions {
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
    performanceTracking?: PerformanceTracking;
}
declare const analyticsPlugin: (options: AnalyticsPluginOptions) => EditorPlugin;
export declare function extendPayload({ payload, duration, distortedDuration, }: {
    payload: AnalyticsEventPayload;
    duration: number;
    distortedDuration: boolean;
}): AnalyticsEventPayload<void>;
export default analyticsPlugin;
