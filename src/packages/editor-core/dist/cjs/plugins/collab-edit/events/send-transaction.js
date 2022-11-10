"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendTransaction = void 0;

var _actions = require("../actions");

var _pluginKey = require("../plugin-key");

var sendTransaction = function sendTransaction(_ref) {
  var originalTransaction = _ref.originalTransaction,
      transactions = _ref.transactions,
      oldEditorState = _ref.oldEditorState,
      newEditorState = _ref.newEditorState,
      useNativePlugin = _ref.useNativePlugin;
  return function (provider) {
    var docChangedTransaction = transactions.find(function (tr) {
      return tr.docChanged;
    });

    var currentPluginState = _pluginKey.pluginKey.getState(newEditorState);

    if (!currentPluginState.isReady) {
      return;
    }

    var shouldSendStepForSynchronyCollabProvider = !originalTransaction.getMeta('isRemote') && // TODO: ED-8995
    // We need to do this check to reduce the number of race conditions when working with tables.
    // This metadata is coming from the scaleTable command in table-resizing plugin
    !originalTransaction.getMeta('scaleTable') && docChangedTransaction;

    if (useNativePlugin || shouldSendStepForSynchronyCollabProvider) {
      provider.send(docChangedTransaction, oldEditorState, newEditorState);
    }

    var prevPluginState = _pluginKey.pluginKey.getState(oldEditorState);

    var prevActiveParticipants = prevPluginState.activeParticipants;
    var activeParticipants = currentPluginState.activeParticipants,
        sessionId = currentPluginState.sessionId;
    var selectionChanged = !oldEditorState.selection.eq(newEditorState.selection);
    var participantsChanged = !prevActiveParticipants.eq(activeParticipants);

    if (sessionId && selectionChanged && !docChangedTransaction || sessionId && participantsChanged) {
      var selection = (0, _actions.getSendableSelection)(newEditorState.selection);
      var message = {
        type: 'telepointer',
        selection: selection,
        sessionId: sessionId
      };
      provider.sendMessage(message);
    }
  };
};

exports.sendTransaction = sendTransaction;