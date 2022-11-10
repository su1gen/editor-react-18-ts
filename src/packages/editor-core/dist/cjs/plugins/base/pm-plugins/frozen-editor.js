"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.frozenEditorPluginKey = exports.default = exports.NORMAL_SEVERITY_THRESHOLD = exports.DEGRADED_SEVERITY_THRESHOLD = exports.DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL = exports.DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED = exports.DEFAULT_FREEZE_THRESHOLD = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _utils = require("@atlaskit/editor-common/utils");

var _ufo = require("@atlaskit/editor-common/ufo");

var _analytics = require("../../analytics");

var _getParticipantsCount = require("../../collab-edit/get-participants-count");

var _countNodes = require("../../../utils/count-nodes");

var _contextIdentifier = require("./context-identifier");

var _frozenEditor = require("../utils/frozen-editor");

var _inputLatencyTracking = _interopRequireDefault(require("../utils/input-latency-tracking"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var frozenEditorPluginKey = new _prosemirrorState.PluginKey('frozenEditor');
exports.frozenEditorPluginKey = frozenEditorPluginKey;
var DEFAULT_KEYSTROKE_SAMPLING_LIMIT = 100;
var DEFAULT_SLOW_THRESHOLD = 300;
var DEFAULT_FREEZE_THRESHOLD = 600;
exports.DEFAULT_FREEZE_THRESHOLD = DEFAULT_FREEZE_THRESHOLD;
var NORMAL_SEVERITY_THRESHOLD = 2000;
exports.NORMAL_SEVERITY_THRESHOLD = NORMAL_SEVERITY_THRESHOLD;
var DEGRADED_SEVERITY_THRESHOLD = 3000;
exports.DEGRADED_SEVERITY_THRESHOLD = DEGRADED_SEVERITY_THRESHOLD;
var DEFAULT_TRACK_SEVERITY_ENABLED = false;
var DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL = 100;
exports.DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL = DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL;
var DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED = 500;
exports.DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED = DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED;

var dispatchLongTaskEvent = function dispatchLongTaskEvent(dispatchAnalyticsEvent, view, time, getNodeCount, interactionType, severity) {
  var _getContextIdentifier;

  var state = view.state;
  var nodesCount = getNodeCount(state);
  return dispatchAnalyticsEvent({
    action: _analytics.ACTION.BROWSER_FREEZE,
    actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
    attributes: _objectSpread(_objectSpread({
      objectId: (_getContextIdentifier = (0, _contextIdentifier.getContextIdentifier)(state)) === null || _getContextIdentifier === void 0 ? void 0 : _getContextIdentifier.objectId,
      freezeTime: time,
      nodeSize: state.doc.nodeSize
    }, nodesCount), {}, {
      participants: (0, _getParticipantsCount.getParticipantsCount)(view.state),
      interactionType: interactionType,
      severity: severity
    }),
    eventType: _analytics.EVENT_TYPE.OPERATIONAL
  });
};

var _default = function _default(dispatchAnalyticsEvent, inputTracking, browserFreezeTracking, ufo) {
  var interactionType;
  var inputLatencyTracker = null;

  if (browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType) {
    interactionType = (0, _frozenEditor.setInteractionType)(_analytics.BROWSER_FREEZE_INTERACTION_TYPE.LOADING);
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

    prevNodeCount = allowCountNodes ? (0, _countNodes.countNodes)(state) : {};
    prevNodeCountState = state;
    return prevNodeCount;
  };

  var shouldTrackSeverity = (inputTracking === null || inputTracking === void 0 ? void 0 : inputTracking.trackSeverity) || DEFAULT_TRACK_SEVERITY_ENABLED;
  var severityThresholdNormal = (inputTracking === null || inputTracking === void 0 ? void 0 : inputTracking.severityNormalThreshold) || DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL;
  var severityThresholdDegraded = (inputTracking === null || inputTracking === void 0 ? void 0 : inputTracking.severityDegradedThreshold) || DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED;
  return new _safePlugin.SafePlugin({
    key: frozenEditorPluginKey,
    props: (0, _utils.isPerformanceAPIAvailable)() ? {
      handleTextInput: function handleTextInput(view) {
        var _inputLatencyTracker;

        (_inputLatencyTracker = inputLatencyTracker) === null || _inputLatencyTracker === void 0 ? void 0 : _inputLatencyTracker.start();

        if (browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType) {
          interactionType = _analytics.BROWSER_FREEZE_INTERACTION_TYPE.TYPING;
        }

        requestAnimationFrame(function () {
          var _inputLatencyTracker2;

          (_inputLatencyTracker2 = inputLatencyTracker) === null || _inputLatencyTracker2 === void 0 ? void 0 : _inputLatencyTracker2.end();
        });
        return false;
      },
      handleDOMEvents: browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType ? {
        click: function click() {
          interactionType = (0, _frozenEditor.setInteractionType)(_analytics.BROWSER_FREEZE_INTERACTION_TYPE.CLICKING);
          return false;
        },
        paste: function paste() {
          interactionType = (0, _frozenEditor.setInteractionType)(_analytics.BROWSER_FREEZE_INTERACTION_TYPE.PASTING);
          return false;
        }
      } : undefined
    } : undefined,
    view: function view(_view) {
      if (!(0, _utils.isPerformanceObserverAvailable)()) {
        return {};
      }

      var experienceStore = ufo ? _ufo.ExperienceStore.getInstance(_view) : undefined;

      if (inputTracking !== null && inputTracking !== void 0 && inputTracking.enabled) {
        inputLatencyTracker = new _inputLatencyTracking.default({
          samplingRate: samplingRate,
          slowThreshold: slowThreshold,
          normalThreshold: severityThresholdNormal,
          degradedThreshold: severityThresholdDegraded,
          onSampleStart: function onSampleStart() {
            experienceStore === null || experienceStore === void 0 ? void 0 : experienceStore.start(_ufo.EditorExperience.typing);
          },
          onSampleEnd: function onSampleEnd(time, _ref) {
            var _getContextIdentifier2;

            var isSlow = _ref.isSlow,
                severity = _ref.severity;
            var state = _view.state;
            var nodesCount = getNodeCount(state);

            if (isSlow) {
              experienceStore === null || experienceStore === void 0 ? void 0 : experienceStore.addMetadata(_ufo.EditorExperience.typing, {
                slowInput: true
              });
            }

            experienceStore === null || experienceStore === void 0 ? void 0 : experienceStore.success(_ufo.EditorExperience.typing, _objectSpread(_objectSpread({
              nodeSize: state.doc.nodeSize
            }, nodesCount), {}, {
              participants: (0, _getParticipantsCount.getParticipantsCount)(state),
              objectId: (_getContextIdentifier2 = (0, _contextIdentifier.getContextIdentifier)(state)) === null || _getContextIdentifier2 === void 0 ? void 0 : _getContextIdentifier2.objectId,
              time: time,
              severity: shouldTrackSeverity ? severity : undefined
            }));
          },
          dispatchSample: function dispatchSample(time, severity) {
            var _getContextIdentifier3;

            var state = _view.state;
            var nodesCount = getNodeCount(state);
            var samplePayload = {
              action: _analytics.ACTION.INPUT_PERF_SAMPLING,
              actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
              attributes: _objectSpread(_objectSpread({
                time: time,
                nodeSize: state.doc.nodeSize
              }, nodesCount), {}, {
                participants: (0, _getParticipantsCount.getParticipantsCount)(state),
                objectId: (_getContextIdentifier3 = (0, _contextIdentifier.getContextIdentifier)(state)) === null || _getContextIdentifier3 === void 0 ? void 0 : _getContextIdentifier3.objectId,
                severity: shouldTrackSeverity ? severity : undefined
              }),
              eventType: _analytics.EVENT_TYPE.OPERATIONAL
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
              action: _analytics.ACTION.INPUT_PERF_SAMPLING_AVG,
              actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
              attributes: _objectSpread(_objectSpread({
                mean: mean,
                median: median,
                sampleSize: sampleSize
              }, nodeCount), {}, {
                nodeSize: state.doc.nodeSize,
                severity: shouldTrackSeverity ? severity : undefined,
                participants: (0, _getParticipantsCount.getParticipantsCount)(state),
                objectId: (_getContextIdentifier4 = (0, _contextIdentifier.getContextIdentifier)(state)) === null || _getContextIdentifier4 === void 0 ? void 0 : _getContextIdentifier4.objectId
              }),
              eventType: _analytics.EVENT_TYPE.OPERATIONAL
            };
            dispatchAnalyticsEvent(averagePayload);
          },
          onSlowInput: function onSlowInput(time) {
            var _getContextIdentifier5;

            var state = _view.state;
            var nodesCount = getNodeCount(state);
            dispatchAnalyticsEvent({
              action: _analytics.ACTION.SLOW_INPUT,
              actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
              attributes: _objectSpread(_objectSpread({
                time: time,
                nodeSize: state.doc.nodeSize
              }, nodesCount), {}, {
                participants: (0, _getParticipantsCount.getParticipantsCount)(state),
                objectId: (_getContextIdentifier5 = (0, _contextIdentifier.getContextIdentifier)(state)) === null || _getContextIdentifier5 === void 0 ? void 0 : _getContextIdentifier5.objectId
              }),
              eventType: _analytics.EVENT_TYPE.OPERATIONAL
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
              dispatchLongTaskEvent(dispatchAnalyticsEvent, _view, duration, getNodeCount, browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackInteractionType ? interactionType : undefined, browserFreezeTracking !== null && browserFreezeTracking !== void 0 && browserFreezeTracking.trackSeverity ? (0, _utils.getAnalyticsEventSeverity)(duration, browserFreezeTracking.severityNormalThreshold || NORMAL_SEVERITY_THRESHOLD, browserFreezeTracking.severityDegradedThreshold || DEGRADED_SEVERITY_THRESHOLD) : undefined);
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
};

exports.default = _default;