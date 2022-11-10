"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachPayloadIntoTransaction = void 0;

var _editorStateContext = require("./editor-state-context");

var _mapAttributes = require("./map-attributes");

var _steps = require("@atlaskit/adf-schema/steps");

var _analytics = require("@atlaskit/editor-common/analytics");

var actionsToIgnore = [_analytics.ACTION.INVOKED, _analytics.ACTION.OPENED];

var attachPayloadIntoTransaction = function attachPayloadIntoTransaction(_ref) {
  var payload = _ref.payload,
      editorState = _ref.editorState,
      tr = _ref.tr,
      channel = _ref.channel;
  payload = (0, _editorStateContext.getStateContext)(editorState, payload);
  payload = (0, _mapAttributes.mapActionSubjectIdToAttributes)(payload);
  var storedMarks = tr.storedMarks;
  tr.step(new _steps.AnalyticsStep([{
    payload: payload,
    channel: channel
  }], actionsToIgnore, tr.selection.$from.pos)); // When you add a new step all the storedMarks are removed it

  if (storedMarks) {
    tr.setStoredMarks(storedMarks);
  }
};

exports.attachPayloadIntoTransaction = attachPayloadIntoTransaction;