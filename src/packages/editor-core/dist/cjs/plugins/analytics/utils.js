"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAnalytics = addAnalytics;
Object.defineProperty(exports, "findInsertLocation", {
  enumerable: true,
  get: function get() {
    return _editorStateContext.findInsertLocation;
  }
});
exports.getAnalyticsEventsFromTransaction = getAnalyticsEventsFromTransaction;
Object.defineProperty(exports, "getSelectionType", {
  enumerable: true,
  get: function get() {
    return _editorStateContext.getSelectionType;
  }
});
Object.defineProperty(exports, "getStateContext", {
  enumerable: true,
  get: function get() {
    return _editorStateContext.getStateContext;
  }
});
Object.defineProperty(exports, "mapActionSubjectIdToAttributes", {
  enumerable: true,
  get: function get() {
    return _mapAttributes.mapActionSubjectIdToAttributes;
  }
});
exports.withAnalytics = withAnalytics;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _steps = require("@atlaskit/adf-schema/steps");

var _consts = require("./consts");

var _pluginKey = require("./plugin-key");

var _attachPayloadIntoTransaction = require("../../analytics-api/attach-payload-into-transaction");

var _mapAttributes = require("../../analytics-api/map-attributes");

var _editorStateContext = require("../../analytics-api/editor-state-context");

function getCreateUIAnalyticsEvent(editorState) {
  var _analyticsPluginKey$g;

  return (_analyticsPluginKey$g = _pluginKey.analyticsPluginKey.getState(editorState)) === null || _analyticsPluginKey$g === void 0 ? void 0 : _analyticsPluginKey$g.createAnalyticsEvent;
}

function addAnalytics(state, tr, payload) {
  var channel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _consts.editorAnalyticsChannel;
  var createAnalyticsEvent = getCreateUIAnalyticsEvent(state);

  if (!createAnalyticsEvent) {
    return tr;
  }

  (0, _attachPayloadIntoTransaction.attachPayloadIntoTransaction)({
    tr: tr,
    editorState: state,
    payload: payload,
    channel: channel
  });
  return tr;
}

function withAnalytics(payload, channel) {
  return function (command) {
    return function (state, dispatch, view) {
      return command(state, function (tr) {
        if (dispatch) {
          if (payload instanceof Function) {
            var dynamicPayload = payload(state);

            if (dynamicPayload) {
              dispatch(addAnalytics(state, tr, dynamicPayload, channel));
            }
          } else {
            dispatch(addAnalytics(state, tr, payload, channel));
          }
        }
      }, view);
    };
  };
}

function getAnalyticsEventsFromTransaction(tr) {
  return tr.steps.filter(function (step) {
    return step instanceof _steps.AnalyticsStep;
  }).reduce(function (acc, step) {
    return [].concat((0, _toConsumableArray2.default)(acc), (0, _toConsumableArray2.default)(step.analyticsEvents));
  }, []);
}