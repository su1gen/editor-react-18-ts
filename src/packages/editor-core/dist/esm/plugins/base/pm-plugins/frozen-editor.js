import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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
export var frozenEditorPluginKey = new PluginKey('frozenEditor');
var DEFAULT_KEYSTROKE_SAMPLING_LIMIT = 100;
var DEFAULT_SLOW_THRESHOLD = 300;
export var DEFAULT_FREEZE_THRESHOLD = 600;
export var NORMAL_SEVERITY_THRESHOLD = 2000;
export var DEGRADED_SEVERITY_THRESHOLD = 3000;
var DEFAULT_TRACK_SEVERITY_ENABLED = false;
export var DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL = 100;
export var DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED = 500;

var dispatchLongTaskEvent = function dispatchLongTaskEvent(dispatchAnalyticsEvent, view, time, getNodeCount, interactionType, severity) {
  var _getContextIdentifier;

  var state = view.state;
  var nodesCount = getNodeCount(state);
  return dispatchAnalyticsEvent({
    action: ACTION.BROWSER_FREEZE,
    actionSubject: ACTION_SUBJECT.EDITOR,
    attributes: _objectSpread(_objectSpread({
      objectId: (_getContextIdentifier = getContextIdentifier(state)) === null || _getContextIdentifier === void 0 ? void 0 : _getContextIdentifier.objectId,
      freezeTime: time,
      nodeSize: state.doc.nodeSize
    }, nodesCount), {}, {
      participants: getParticipantsCount(view.state),
      interactionType: interactionType,
      severity: severity
    }),
    eventType: EVENT_TYPE.OPERATIONAL
  });
};

export default (function (dispatchAnalyticsEvent, inputTracking, browserFreezeTracking, ufo) {
  var interactionType;
  var inputLatencyTracker = null;

  if (browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType) {
    interactionType = setInteractionType(BROWSER_FREEZE_INTERACTION_TYPE.LOADING);
  }

  var samplingRate = inputTracking && typeof inputTracking.samplingRate === 'number' ? inputTracking.samplingRate : DEFAULT_KEYSTROKE_SAMPLING_LIMIT;
  var slowThreshold = inputTracking && typeof inputTracking.slowThreshold === 'number' ? inputTracking.slowThreshold : DEFAULT_SLOW_THRESHOLD;
  var freezeThreshold = inputTracking && typeof inputTracking.freezeThreshold === 'number' ? inputTracking.freezeThreshold : DEFAULT_FREEZE_THRESHOLD;
  var allowCountNodes = inputTracking && inputTracking.countNodes;
  var prevNodeCountState = null;
  var prevNodeCount = {}; // Cache the result as we were calling this multiple times
  // and has potential to be expensive

  var getNodeCount = function getNodeCount(state) {
    if (state === prevNodeCountState) {
      return prevNodeCount;
    }

    prevNodeCount = allowCountNodes ? countNodes(state) : {};
    prevNodeCountState = state;
    return prevNodeCount;
  };

  var shouldTrackSeverity = (inputTracking === null || inputTracking === void 0 ? void 0 : inputTracking.trackSeverity) || DEFAULT_TRACK_SEVERITY_ENABLED;
  var severityThresholdNormal = (inputTracking === null || inputTracking === void 0 ? void 0 : inputTracking.severityNormalThreshold) || DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL;
  var severityThresholdDegraded = (inputTracking === null || inputTracking === void 0 ? void 0 : inputTracking.severityDegradedThreshold) || DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED;
  return new SafePlugin({
    key: frozenEditorPluginKey,
    props: isPerformanceAPIAvailable() ? {
      handleTextInput: function handleTextInput(view) {
        var _inputLatencyTracker;

        (_inputLatencyTracker = inputLatencyTracker) === null || _inputLatencyTracker === void 0 ? void 0 : _inputLatencyTracker.start();

        if (browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType) {
          interactionType = BROWSER_FREEZE_INTERACTION_TYPE.TYPING;
        }

        requestAnimationFrame(function () {
          var _inputLatencyTracker2;

          (_inputLatencyTracker2 = inputLatencyTracker) === null || _inputLatencyTracker2 === void 0 ? void 0 : _inputLatencyTracker2.end();
        });
        return false;
      },
      handleDOMEvents: browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType ? {
        click: function click() {
          interactionType = setInteractionType(BROWSER_FREEZE_INTERACTION_TYPE.CLICKING);
          return false;
        },
        paste: function paste() {
          interactionType = setInteractionType(BROWSER_FREEZE_INTERACTION_TYPE.PASTING);
          return false;
        }
      } : undefined
    } : undefined,
    view: function view(_view) {
      if (!isPerformanceObserverAvailable()) {
        return {};
      }

      var experienceStore = ufo ? ExperienceStore.getInstance(_view) : undefined;

      if (inputTracking !== null && inputTracking !== void 0 && inputTracking.enabled) {
        inputLatencyTracker = new InputLatencyTracker({
          samplingRate: samplingRate,
          slowThreshold: slowThreshold,
          normalThreshold: severityThresholdNormal,
          degradedThreshold: severityThresholdDegraded,
          onSampleStart: function onSampleStart() {
            experienceStore === null || experienceStore === void 0 ? void 0 : experienceStore.start(EditorExperience.typing);
          },
          onSampleEnd: function onSampleEnd(time, _ref) {
            var _getContextIdentifier2;

            var isSlow = _ref.isSlow,
                severity = _ref.severity;
            var state = _view.state;
            var nodesCount = getNodeCount(state);

            if (isSlow) {
              experienceStore === null || experienceStore === void 0 ? void 0 : experienceStore.addMetadata(EditorExperience.typing, {
                slowInput: true
              });
            }

            experienceStore === null || experienceStore === void 0 ? void 0 : experienceStore.success(EditorExperience.typing, _objectSpread(_objectSpread({
              nodeSize: state.doc.nodeSize
            }, nodesCount), {}, {
              participants: getParticipantsCount(state),
              objectId: (_getContextIdentifier2 = getContextIdentifier(state)) === null || _getContextIdentifier2 === void 0 ? void 0 : _getContextIdentifier2.objectId,
              time: time,
              severity: shouldTrackSeverity ? severity : undefined
            }));
          },
          dispatchSample: function dispatchSample(time, severity) {
            var _getContextIdentifier3;

            var state = _view.state;
            var nodesCount = getNodeCount(state);
            var samplePayload = {
              action: ACTION.INPUT_PERF_SAMPLING,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: _objectSpread(_objectSpread({
                time: time,
                nodeSize: state.doc.nodeSize
              }, nodesCount), {}, {
                participants: getParticipantsCount(state),
                objectId: (_getContextIdentifier3 = getContextIdentifier(state)) === null || _getContextIdentifier3 === void 0 ? void 0 : _getContextIdentifier3.objectId,
                severity: shouldTrackSeverity ? severity : undefined
              }),
              eventType: EVENT_TYPE.OPERATIONAL
            };
            dispatchAnalyticsEvent(samplePayload);
          },
          dispatchAverage: function dispatchAverage(_ref2, severity) {
            var _getContextIdentifier4;

            var mean = _ref2.mean,
                median = _ref2.median,
                sampleSize = _ref2.sampleSize;
            var state = _view.state;
            var nodeCount = getNodeCount(state);
            var averagePayload = {
              action: ACTION.INPUT_PERF_SAMPLING_AVG,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: _objectSpread(_objectSpread({
                mean: mean,
                median: median,
                sampleSize: sampleSize
              }, nodeCount), {}, {
                nodeSize: state.doc.nodeSize,
                severity: shouldTrackSeverity ? severity : undefined,
                participants: getParticipantsCount(state),
                objectId: (_getContextIdentifier4 = getContextIdentifier(state)) === null || _getContextIdentifier4 === void 0 ? void 0 : _getContextIdentifier4.objectId
              }),
              eventType: EVENT_TYPE.OPERATIONAL
            };
            dispatchAnalyticsEvent(averagePayload);
          },
          onSlowInput: function onSlowInput(time) {
            var _getContextIdentifier5;

            var state = _view.state;
            var nodesCount = getNodeCount(state);
            dispatchAnalyticsEvent({
              action: ACTION.SLOW_INPUT,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: _objectSpread(_objectSpread({
                time: time,
                nodeSize: state.doc.nodeSize
              }, nodesCount), {}, {
                participants: getParticipantsCount(state),
                objectId: (_getContextIdentifier5 = getContextIdentifier(state)) === null || _getContextIdentifier5 === void 0 ? void 0 : _getContextIdentifier5.objectId
              }),
              eventType: EVENT_TYPE.OPERATIONAL
            });
          }
        });
      }

      var observer;

      try {
        var _observer = new PerformanceObserver(function (list) {
          var perfEntries = list.getEntries();

          for (var i = 0; i < perfEntries.length; i++) {
            var duration = perfEntries[i].duration;

            if (duration > freezeThreshold) {
              dispatchLongTaskEvent(dispatchAnalyticsEvent, _view, duration, getNodeCount, browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType ? interactionType : undefined, browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackSeverity ? getAnalyticsEventSeverity(duration, browserFreezeTracking.severityNormalThreshold || NORMAL_SEVERITY_THRESHOLD, browserFreezeTracking.severityDegradedThreshold || DEGRADED_SEVERITY_THRESHOLD) : undefined);
            }
          }
        }); // register observer for long task notifications


        _observer.observe({
          entryTypes: ['longtask']
        });
      } catch (e) {}

      return {
        destroy: function destroy() {
          var _inputLatencyTracker3;

          (_inputLatencyTracker3 = inputLatencyTracker) === null || _inputLatencyTracker3 === void 0 ? void 0 : _inputLatencyTracker3.flush();
          observer === null || observer === void 0 ? void 0 : observer.disconnect();
        }
      };
    }
  });
});