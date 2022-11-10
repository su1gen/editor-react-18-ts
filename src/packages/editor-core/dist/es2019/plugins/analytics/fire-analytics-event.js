import { editorAnalyticsChannel } from './consts';
import { AnalyticsQueue } from './analytics-queue';
export const fireAnalyticsEvent = createAnalyticsEvent => ({
  payload,
  channel = editorAnalyticsChannel
}) => {
  if (!createAnalyticsEvent) {
    return;
  } // START TEMPORARY CODE ED-10584
  // __queueAnalytics property set in ReactEditorView based on featureFlags.queueAnalytics


  const queueAnalytics = Boolean(createAnalyticsEvent.__queueAnalytics); // END TEMPORARY CODE ED-10584

  if (queueAnalytics) {
    const queue = AnalyticsQueue.get();
    queue.schedule(() => {
      var _createAnalyticsEvent;

      return (_createAnalyticsEvent = createAnalyticsEvent(payload)) === null || _createAnalyticsEvent === void 0 ? void 0 : _createAnalyticsEvent.fire(channel);
    });
  } else {
    var _createAnalyticsEvent2;

    (_createAnalyticsEvent2 = createAnalyticsEvent(payload)) === null || _createAnalyticsEvent2 === void 0 ? void 0 : _createAnalyticsEvent2.fire(channel);
  }
};