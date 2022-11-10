import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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

  var hasRequiredPerformanceAPIs = isPerformanceAPIAvailable();
  return new SafePlugin({
    key: analyticsPluginKey,
    state: {
      init: function init() {
        return _objectSpread(_objectSpread({}, options), {}, {
          fireAnalytics: fireAnalyticsEvent(options.createAnalyticsEvent)
        });
      },
      apply: function apply(tr, pluginState, _, state) {
        var _getFeatureFlags;

        if ((_getFeatureFlags = getFeatureFlags(state)) !== null && _getFeatureFlags !== void 0 && _getFeatureFlags.catchAllTracking) {
          var analyticsEventWithChannel = getAnalyticsEventsFromTransaction(tr);

          if (analyticsEventWithChannel.length > 0) {
            var _iterator = _createForOfIteratorHelper(analyticsEventWithChannel),
                _step;

            try {
              var _loop = function _loop() {
                var _step$value = _step.value,
                    payload = _step$value.payload,
                    channel = _step$value.channel;

                // Measures how much time it takes to update the DOM after each ProseMirror document update
                // that has an analytics event.
                if (hasRequiredPerformanceAPIs && tr.docChanged && payload.action !== ACTION.INSERTED && payload.action !== ACTION.DELETED) {
                  var measureName = "".concat(payload.actionSubject, ":").concat(payload.action, ":").concat(payload.actionSubjectId);
                  measureRender( // NOTE this name could be resulting in misleading data -- where if multiple payloads are
                  // received before a render completes -- the measurement value will be inaccurate (this is
                  // due to measureRender requiring unique measureNames)
                  measureName, function (_ref) {
                    var duration = _ref.duration,
                        distortedDuration = _ref.distortedDuration;
                    fireAnalyticsEvent(pluginState.createAnalyticsEvent)({
                      payload: extendPayload({
                        payload: payload,
                        duration: duration,
                        distortedDuration: distortedDuration
                      }),
                      channel: channel
                    });
                  });
                }
              };

              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                _loop();
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        }

        return pluginState;
      }
    }
  });
}

var analyticsPlugin = function analyticsPlugin(options) {
  return {
    name: 'analytics',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'analyticsPlugin',
        plugin: function plugin() {
          return createPlugin(options);
        }
      }];
    },
    onEditorViewStateUpdated: function onEditorViewStateUpdated(_ref2) {
      var originalTransaction = _ref2.originalTransaction,
          transactions = _ref2.transactions,
          newEditorState = _ref2.newEditorState;
      var pluginState = analyticsPluginKey.getState(newEditorState);

      if (!pluginState || !pluginState.createAnalyticsEvent) {
        return;
      }

      var steps = transactions.reduce(function (acc, tr) {
        var payloads = tr.steps.filter(function (step) {
          return step instanceof AnalyticsStep;
        }).map(function (x) {
          return x.analyticsEvents;
        }).reduce(function (acc, val) {
          return acc.concat(val);
        }, []);
        acc.push.apply(acc, _toConsumableArray(payloads));
        return acc;
      }, []);

      if (steps.length === 0) {
        return;
      }

      var createAnalyticsEvent = pluginState.createAnalyticsEvent;
      var undoAnaltyicsEventTransformer = generateUndoRedoInputSoucePayload(originalTransaction);
      steps.forEach(function (_ref3) {
        var payload = _ref3.payload,
            channel = _ref3.channel;
        var nextPayload = undoAnaltyicsEventTransformer(payload);
        fireAnalyticsEvent(createAnalyticsEvent)({
          payload: nextPayload,
          channel: channel
        });
      });
    }
  };
};

export function extendPayload(_ref4) {
  var payload = _ref4.payload,
      duration = _ref4.duration,
      distortedDuration = _ref4.distortedDuration;
  return _objectSpread(_objectSpread({}, payload), {}, {
    attributes: _objectSpread(_objectSpread({}, payload.attributes), {}, {
      duration: duration,
      distortedDuration: distortedDuration
    }),
    eventType: EVENT_TYPE.OPERATIONAL
  });
}
export default analyticsPlugin;