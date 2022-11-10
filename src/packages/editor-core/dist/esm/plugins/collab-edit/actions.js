import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { receiveTransaction } from 'prosemirror-collab';
import { Step } from 'prosemirror-transform';
import { AllSelection, NodeSelection } from 'prosemirror-state';
import { replaceDocument } from './utils';
export var handleInit = function handleInit(initData, view, options) {
  var doc = initData.doc,
      json = initData.json,
      version = initData.version,
      reserveCursor = initData.reserveCursor;

  if (doc) {
    var state = view.state;
    var tr = replaceDocument(doc, state, version, options, reserveCursor);
    tr.setMeta('isRemote', true);
    view.dispatch(tr);
  } else if (json) {
    applyRemoteSteps(json, undefined, view);
  }
};
export var handleConnection = function handleConnection(connectionData, view) {
  var tr = view.state.tr;
  view.dispatch(tr.setMeta('sessionId', connectionData));
};
export var handlePresence = function handlePresence(presenceData, view) {
  var tr = view.state.tr;
  view.dispatch(tr.setMeta('presence', presenceData));
};
export var applyRemoteData = function applyRemoteData(remoteData, view, options) {
  var json = remoteData.json,
      _remoteData$userIds = remoteData.userIds,
      userIds = _remoteData$userIds === void 0 ? [] : _remoteData$userIds;

  if (json) {
    applyRemoteSteps(json, userIds, view, options);
  }
};
export var applyRemoteSteps = function applyRemoteSteps(json, userIds, view, options) {
  if (!json || !json.length) {
    return;
  }

  var state = view.state,
      schema = view.state.schema;
  var steps = json.map(function (step) {
    return Step.fromJSON(schema, step);
  });
  var tr;

  if (options && options.useNativePlugin && userIds) {
    tr = receiveTransaction(state, steps, userIds);
  } else {
    tr = state.tr;
    steps.forEach(function (step) {
      return tr.step(step);
    });
  }

  if (tr) {
    tr.setMeta('addToHistory', false);
    tr.setMeta('isRemote', true);
    var _state$selection = state.selection,
        from = _state$selection.from,
        to = _state$selection.to;

    var _json = _slicedToArray(json, 1),
        firstStep = _json[0];
    /*
     * Persist marks across transactions. Fixes an issue where
     * marks are lost if remote transactions are dispatched
     * between a user creating the mark and typing.
     */


    if (state.tr.storedMarks) {
      tr.setStoredMarks(state.tr.storedMarks);
    }
    /**
     * If the cursor is a the same position as the first step in
     * the remote data, we need to manually set it back again
     * in order to prevent the cursor from moving.
     */


    if (from === firstStep.from && to === firstStep.to) {
      tr.setSelection(state.selection.map(tr.doc, tr.mapping));
    }

    view.dispatch(tr);
  }
};
export var handleTelePointer = function handleTelePointer(telepointerData, view) {
  var tr = view.state.tr;
  view.dispatch(tr.setMeta('telepointer', telepointerData));
};

function isAllSelection(selection) {
  return selection instanceof AllSelection;
}

function isNodeSelection(selection) {
  return selection instanceof NodeSelection;
}

export var getSendableSelection = function getSendableSelection(selection) {
  /**
   * <kbd>CMD + A</kbd> triggers a AllSelection
   * <kbd>escape</kbd> triggers a NodeSelection
   */
  return {
    type: 'textSelection',
    anchor: selection.anchor,
    head: isAllSelection(selection) || isNodeSelection(selection) ? selection.head - 1 : selection.head
  };
};