import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { isPerformanceAPIAvailable, measureRender } from '@atlaskit/editor-common/utils';
import { ACTION, EVENT_TYPE } from './types';
import { getAnalyticsEventsFromTransaction } from './utils';
import { analyticsPluginKey } from './plugin-key';
import { fireAnalyticsEvent } from './fire-analytics-event';
import { getFeatureFlags } from '../feature-flags-context';
import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { generateUndoRedoInputSoucePayload } from '../undo-redo/undo-redo-input-source';

function createPlugin(options) {
  if (!options || !options.createAnalyticsEvent) {
    return;
  }

  const hasRequiredPerformanceAPIs = isPerformanceAPIAvailable();
  return new SafePlugin({
    key: analyticsPluginKey,
    state: {
      init: () => {
        return { ...options,
          fireAnalytics: fireAnalyticsEvent(options.createAnalyticsEvent)
        };
      },
      apply: (tr, pluginState, _, state) => {
        var _getFeatureFlags;

        if ((_getFeatureFlags = getFeatureFlags(state)) !== null && _getFeatureFlags !== void 0 && _getFeatureFlags.catchAllTracking) {
          const analyticsEventWithChannel = getAnalyticsEventsFromTransaction(tr);

          if (analyticsEventWithChannel.length > 0) {
            for (const {
              payload,
              channel
            } of analyticsEventWithChannel) {
              // Measures how much time it takes to update the DOM after each ProseMirror document update
              // that has an analytics event.
              if (hasRequiredPerformanceAPIs && tr.docChanged && payload.action !== ACTION.INSERTED && payload.action !== ACTION.DELETED) {
                const measureName = `${payload.actionSubject}:${payload.action}:${payload.actionSubjectId}`;
                measureRender( // NOTE this name could be resulting in misleading data -- where if multiple payloads are
                // received before a render completes -- the measurement value will be inaccurate (this is
                // due to measureRender requiring unique measureNames)
                measureName, ({
                  duration,
                  distortedDuration
                }) => {
                  fireAnalyticsEvent(pluginState.createAnalyticsEvent)({
                    payload: extendPayload({
                      payload,
                      duration,
                      distortedDuration
                    }),
                    channel
                  });
                });
              }
            }
          }
        }

        return pluginState;
      }
    }
  });
}

const analyticsPlugin = options => ({
  name: 'analytics',

  pmPlugins() {
    return [{
      name: 'analyticsPlugin',
      plugin: () => createPlugin(options)
    }];
  },

  onEditorViewStateUpdated({
    originalTransaction,
    transactions,
    newEditorState
  }) {
    const pluginState = analyticsPluginKey.getState(newEditorState);

    if (!pluginState || !pluginState.createAnalyticsEvent) {
      return;
    }

    const steps = transactions.reduce((acc, tr) => {
      const payloads = tr.steps.filter(step => step instanceof AnalyticsStep).map(x => x.analyticsEvents).reduce((acc, val) => acc.concat(val), []);
      acc.push(...payloads);
      return acc;
    }, []);

    if (steps.length === 0) {
      return;
    }

    const {
      createAnalyticsEvent
    } = pluginState;
    const undoAnaltyicsEventTransformer = generateUndoRedoInputSoucePayload(originalTransaction);
    steps.forEach(({
      payload,
      channel
    }) => {
      const nextPayload = undoAnaltyicsEventTransformer(payload);
      fireAnalyticsEvent(createAnalyticsEvent)({
        payload: nextPayload,
        channel
      });
    });
  }

});

export function extendPayload({
  payload,
  duration,
  distortedDuration
}) {
  return { ...payload,
    attributes: { ...payload.attributes,
      duration,
      distortedDuration
    },
    eventType: EVENT_TYPE.OPERATIONAL
  };
}
export default analyticsPlugin;