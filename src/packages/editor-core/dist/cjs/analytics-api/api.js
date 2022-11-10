"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEditorAnalyticsAPI = void 0;

var _analyticsListeners = require("@atlaskit/analytics-listeners");

var _attachPayloadIntoTransaction = require("./attach-payload-into-transaction");

var createEditorAnalyticsAPI = function createEditorAnalyticsAPI(_ref) {
  var getEditorView = _ref.getEditorView,
      getCreateUIAnalyticsEvent = _ref.getCreateUIAnalyticsEvent;
  return {
    attachAnalyticsEvent: function attachAnalyticsEvent(payload) {
      return function (tr) {
        var createAnalyticsEvent = getCreateUIAnalyticsEvent();
        var editorView = getEditorView();

        if (!tr || !createAnalyticsEvent || !editorView) {
          return false;
        }

        var editorState = editorView.state;
        (0, _attachPayloadIntoTransaction.attachPayloadIntoTransaction)({
          tr: tr,
          editorState: editorState,
          payload: payload,
          channel: _analyticsListeners.FabricChannel.editor
        });
        return true;
      };
    }
  };
};

exports.createEditorAnalyticsAPI = createEditorAnalyticsAPI;