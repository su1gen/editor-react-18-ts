"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDispatchTransaction = createDispatchTransaction;
exports.getEditorValue = getEditorValue;

var _prosemirrorModel = require("prosemirror-model");

var _analytics = require("../../../../../plugins/analytics");

var _nodes = require("../../../../../utils/nodes");

var _utils = require("../../../../../utils");

var _documentLogger = require("../../../../../utils/document-logger");

var _consts = require("../../../../../plugins/analytics/consts");

// Helper to assure correct payload when dispatch analytics
function dispatchAnalytics(dispatch, payload) {
  dispatch(_consts.analyticsEventKey, payload);
}

function createDispatchTransaction(editorSharedConfig) {
  return function dispatchTransaction(transaction) {
    var editorView = editorSharedConfig.editorView,
        onChange = editorSharedConfig.onChange,
        transformer = editorSharedConfig.transformer,
        dispatch = editorSharedConfig.dispatch;

    if (!editorView) {
      return;
    }

    var nodes = (0, _nodes.findChangedNodesFromTransaction)(transaction);

    if ((0, _nodes.validateNodes)(nodes)) {
      // go ahead and update the state now we know the transaction is good
      var editorState = editorView.state.apply(transaction);
      editorView.updateState(editorState);

      if (onChange && transaction.docChanged) {
        onChange(getEditorValue(editorView, transformer), {
          source: 'local'
        });
      }
    } else {
      // If invalid document, send analytics event with the structure of the nodes
      if (dispatch) {
        var invalidNodes = nodes.filter(function (node) {
          return !(0, _nodes.validNode)(node);
        }).map(function (node) {
          return (0, _documentLogger.getDocStructure)(node);
        });
        dispatchAnalytics(dispatch, {
          action: _analytics.ACTION.DISPATCHED_INVALID_TRANSACTION,
          actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
          eventType: _analytics.EVENT_TYPE.OPERATIONAL,
          attributes: {
            analyticsEventPayloads: (0, _analytics.getAnalyticsEventsFromTransaction)(transaction),
            invalidNodes: invalidNodes
          }
        });
      }
    }
  };
}

function getEditorValue(editorView, transformer) {
  return (0, _utils.compose)(function (doc) {
    return transformer && transformer.encode ? transformer.encode(_prosemirrorModel.Node.fromJSON(editorView.state.schema, doc)) : doc;
  }, _utils.toJSON)(editorView.state.doc);
}