import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { isPerformanceObserverAvailable, isPerformanceAPIAvailable, getAnalyticsEventSeverity } from '@atlaskit/editor-common/utils';
import { EditorExperience, ExperienceStore } from '@atlaskit/editor-common/ufo';
import { ACTION, ACTION_SUBJECT, BROWSER_FREEZE_INTERACTION_TYPE, EVENT_TYPE } from '../../analytics';
import { getParticipantsCount } from '../../collab-edit/get-participants-count';
import { countNodes } from '../../../utils/count-nodes';
import { getContextIdentifier } from './context-identifier';
import { setInteractionType } from '../utils/frozen-editor';
import InputLatencyTracker from '../utils/input-latency-tracking';
export const frozenEditorPluginKey = new PluginKey('frozenEditor');
const DEFAULT_KEYSTROKE_SAMPLING_LIMIT = 100;
const DEFAULT_SLOW_THRESHOLD = 300;
export const DEFAULT_FREEZE_THRESHOLD = 600;
export const NORMAL_SEVERITY_THRESHOLD = 2000;
export const DEGRADED_SEVERITY_THRESHOLD = 3000;
const DEFAULT_TRACK_SEVERITY_ENABLED = false;
export const DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL = 100;
export const DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED = 500;

const dispatchLongTaskEvent = (dispatchAnalyticsEvent, view, time, getNodeCount, interactionType, severity) => {
  var _getContextIdentifier;

  const {
    state
  } = view;
  const nodesCount = getNodeCount(state);
  return dispatchAnalyticsEvent({
    action: ACTION.BROWSER_FREEZE,
    actionSubject: ACTION_SUBJECT.EDITOR,
    attributes: {
      objectId: (_getContextIdentifier = getContextIdentifier(state)) === null || _getContextIdentifier === void 0 ? void 0 : _getContextIdentifier.objectId,
      freezeTime: time,
      nodeSize: state.doc.nodeSize,
      ...nodesCount,
      participants: getParticipantsCount(view.state),
      interactionType,
      severity
    },
    eventType: EVENT_TYPE.OPERATIONAL
  });
};

export default ((dispatchAnalyticsEvent, inputTracking, browserFreezeTracking, ufo) => {
  let interactionType;
  let inputLatencyTracker = null;

  if (browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType) {
    interactionType = setInteractionType(BROWSER_FREEZE_INTERACTION_TYPE.LOADING);
  }

  const samplingRate = inputTracking && typeof inputTracking.samplingRate === 'number' ? inputTracking.samplingRate : DEFAULT_KEYSTROKE_SAMPLING_LIMIT;
  const slowThreshold = inputTracking && typeof inputTracking.slowThreshold === 'number' ? inputTracking.slowThreshold : DEFAULT_SLOW_THRESHOLD;
  const freezeThreshold = inputTracking && typeof inputTracking.freezeThreshold === 'number' ? inputTracking.freezeThreshold : DEFAULT_FREEZE_THRESHOLD;
  const allowCountNodes = inputTracking && inputTracking.countNodes;
  let prevNodeCountState = null;
  let prevNodeCount = {}; // Cache the result as we were calling this multiple times
  // and has potential to be expensive

  const getNodeCount = state => {
    if (state === prevNodeCountState) {
      return prevNodeCount;
    }

    prevNodeCount = allowCountNodes ? countNodes(state) : {};
    prevNodeCountState = state;
    return prevNodeCount;
  };

  const shouldTrackSeverity = (inputTracking === null || inputTracking === void 0 ? void 0 : inputTracking.trackSeverity) || DEFAULT_TRACK_SEVERITY_ENABLED;
  const severityThresholdNormal = (inputTracking === null || inputTracking === void 0 ? void 0 : inputTracking.severityNormalThreshold) || DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL;
  const severityThresholdDegraded = (inputTracking === null || inputTracking === void 0 ? void 0 : inputTracking.severityDegradedThreshold) || DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED;
  return new SafePlugin({
    key: frozenEditorPluginKey,
    props: isPerformanceAPIAvailable() ? {
      handleTextInput(view) {
        var _inputLatencyTracker;

        (_inputLatencyTracker = inputLatencyTracker) === null || _inputLatencyTracker === void 0 ? void 0 : _inputLatencyTracker.start();

        if (browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType) {
          interactionType = BROWSER_FREEZE_INTERACTION_TYPE.TYPING;
        }

        requestAnimationFrame(() => {
          var _inputLatencyTracker2;

          (_inputLatencyTracker2 = inputLatencyTracker) === null || _inputLatencyTracker2 === void 0 ? void 0 : _inputLatencyTracker2.end();
        });
        return false;
      },

      handleDOMEvents: browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType ? {
        click: () => {
          interactionType = setInteractionType(BROWSER_FREEZE_INTERACTION_TYPE.CLICKING);
          return false;
        },
        paste: () => {
          interactionType = setInteractionType(BROWSER_FREEZE_INTERACTION_TYPE.PASTING);
          return false;
        }
      } : undefined
    } : undefined,

    view(view) {
      if (!isPerformanceObserverAvailable()) {
        return {};
      }

      const experienceStore = ufo ? ExperienceStore.getInstance(view) : undefined;

      if (inputTracking !== null && inputTracking !== void 0 && inputTracking.enabled) {
        inputLatencyTracker = new InputLatencyTracker({
          samplingRate,
          slowThreshold,
          normalThreshold: severityThresholdNormal,
          degradedThreshold: severityThresholdDegraded,
          onSampleStart: () => {
            experienceStore === null || experienceStore === void 0 ? void 0 : experienceStore.start(EditorExperience.typing);
          },
          onSampleEnd: (time, {
            isSlow,
            severity
          }) => {
            var _getContextIdentifier2;

            const {
              state
            } = view;
            const nodesCount = getNodeCount(state);

            if (isSlow) {
              experienceStore === null || experienceStore === void 0 ? void 0 : experienceStore.addMetadata(EditorExperience.typing, {
                slowInput: true
              });
            }

            experienceStore === null || experienceStore === void 0 ? void 0 : experienceStore.success(EditorExperience.typing, {
              nodeSize: state.doc.nodeSize,
              ...nodesCount,
              participants: getParticipantsCount(state),
              objectId: (_getContextIdentifier2 = getContextIdentifier(state)) === null || _getContextIdentifier2 === void 0 ? void 0 : _getContextIdentifier2.objectId,
              time,
              severity: shouldTrackSeverity ? severity : undefined
            });
          },
          dispatchSample: (time, severity) => {
            var _getContextIdentifier3;

            const {
              state
            } = view;
            const nodesCount = getNodeCount(state);
            const samplePayload = {
              action: ACTION.INPUT_PERF_SAMPLING,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: {
                time,
                nodeSize: state.doc.nodeSize,
                ...nodesCount,
                participants: getParticipantsCount(state),
                objectId: (_getContextIdentifier3 = getContextIdentifier(state)) === null || _getContextIdentifier3 === void 0 ? void 0 : _getContextIdentifier3.objectId,
                severity: shouldTrackSeverity ? severity : undefined
              },
              eventType: EVENT_TYPE.OPERATIONAL
            };
            dispatchAnalyticsEvent(samplePayload);
          },
          dispatchAverage: ({
            mean,
            median,
            sampleSize
          }, severity) => {
            var _getContextIdentifier4;

            const {
              state
            } = view;
            const nodeCount = getNodeCount(state);
            const averagePayload = {
              action: ACTION.INPUT_PERF_SAMPLING_AVG,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: {
                mean,
                median,
                sampleSize,
                ...nodeCount,
                nodeSize: state.doc.nodeSize,
                severity: shouldTrackSeverity ? severity : undefined,
                participants: getParticipantsCount(state),
                objectId: (_getContextIdentifier4 = getContextIdentifier(state)) === null || _getContextIdentifier4 === void 0 ? void 0 : _getContextIdentifier4.objectId
              },
              eventType: EVENT_TYPE.OPERATIONAL
            };
            dispatchAnalyticsEvent(averagePayload);
          },
          onSlowInput: time => {
            var _getContextIdentifier5;

            const {
              state
            } = view;
            const nodesCount = getNodeCount(state);
            dispatchAnalyticsEvent({
              action: ACTION.SLOW_INPUT,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: {
                time,
                nodeSize: state.doc.nodeSize,
                ...nodesCount,
                participants: getParticipantsCount(state),
                objectId: (_getContextIdentifier5 = getContextIdentifier(state)) === null || _getContextIdentifier5 === void 0 ? void 0 : _getContextIdentifier5.objectId
              },
              eventType: EVENT_TYPE.OPERATIONAL
            });
          }
        });
      }

      let observer;

      try {
        const observer = new PerformanceObserver(list => {
          const perfEntries = list.getEntries();

          for (let i = 0; i < perfEntries.length; i++) {
            const {
              duration
            } = perfEntries[i];

            if (duration > freezeThreshold) {
              dispatchLongTaskEvent(dispatchAnalyticsEvent, view, duration, getNodeCount, browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType ? interactionType : undefined, browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackSeverity ? getAnalyticsEventSeverity(duration, browserFreezeTracking.severityNormalThreshold || NORMAL_SEVERITY_THRESHOLD, browserFreezeTracking.severityDegradedThreshold || DEGRADED_SEVERITY_THRESHOLD) : undefined);
            }
          }
        }); // register observer for long task notifications

        observer.observe({
          entryTypes: ['longtask']
        });
      } catch (e) {}

      return {
        destroy: () => {
          var _inputLatencyTracker3;

          (_inputLatencyTracker3 = inputLatencyTracker) === null || _inputLatencyTracker3 === void 0 ? void 0 : _inputLatencyTracker3.flush();
          observer === null || observer === void 0 ? void 0 : observer.disconnect();
        }
      };
    }

  });
});