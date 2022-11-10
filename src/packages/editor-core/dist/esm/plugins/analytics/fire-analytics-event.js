import { editorAnalyticsChannel } from './consts';
import { AnalyticsQueue } from './analytics-queue';
export var fireAnalyticsEvent = function fireAnalyticsEvent(createAnalyticsEvent) {
  return function (_ref) {
    var payload = _ref.payload,
        _ref$channel = _ref.channel,
        channel = _ref$channel === void 0 ? editorAnalyticsChannel : _ref$channel;

    if (!createAnalyticsEvent) {
      return;
    } // START TEMPORARY CODE ED-10584
    // __queueAnalytics property set in ReactEditorView based on featureFlags.queueAnalytics


    var queueAnalytics = Boolean(createAnalyticsEvent.__queueAnalytics); // END TEMPORARY CODE ED-10584

    if (queueAnalytics) {
      var queue = AnalyticsQueue.get();
      queue.schedule(function () {
        var _createAnalyticsEvent;

        return (_createAnalyticsEvent = createAnalyticsEvent(payload)) === null || _createAnalyticsEvent === void 0 ? void 0 : _createAnalyticsEvent.fire(channel);
      });
    } else {
      var _createAnalyticsEvent2;

      (_createAnalyticsEvent2 = createAnalyticsEvent(payload)) === null || _createAnalyticsEvent2 === void 0 ? void 0 : _createAnalyticsEvent2.fire(channel);
    }
  };
};