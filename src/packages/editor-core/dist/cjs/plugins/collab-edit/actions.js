"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTelePointer = exports.handlePresence = exports.handleInit = exports.handleConnection = exports.getSendableSelection = exports.applyRemoteSteps = exports.applyRemoteData = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _prosemirrorCollab = require("prosemirror-collab");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorState = require("prosemirror-state");

var _utils = require("./utils");

var handleInit = function handleInit(initData, view, options) {
  var doc = initData.doc,
      json = initData.json,
      version = initData.version,
      reserveCursor = initData.reserveCursor;

  if (doc) {
    var state = view.state;
    var tr = (0, _utils.replaceDocument)(doc, state, version, options, reserveCursor);
    tr.setMeta('isRemote', true);
    view.dispatch(tr);
  } else if (json) {
    applyRemoteSteps(json, undefined, view);
  }
};

exports.handleInit = handleInit;

var handleConnection = function handleConnection(connectionData, view) {
  var tr = view.state.tr;
  view.dispatch(tr.setMeta('sessionId', connectionData));
};

exports.handleConnection = handleConnection;

var handlePresence = function handlePresence(presenceData, view) {
  var tr = view.state.tr;
  view.dispatch(tr.setMeta('presence', presenceData));
};

exports.handlePresence = handlePresence;

var applyRemoteData = function applyRemoteData(remoteData, view, options) {
  var json = remoteData.json,
      _remoteData$userIds = remoteData.userIds,
      userIds = _remoteData$userIds === void 0 ? [] : _remoteData$userIds;

  if (json) {
    applyRemoteSteps(json, userIds, view, options);
  }
};

exports.applyRemoteData = applyRemoteData;

var applyRemoteSteps = function applyRemoteSteps(json, userIds, view, options) {
  if (!json || !json.length) {
    return;
  }

  var state = view.state,
      schema = view.state.schema;
  var steps = json.map(function (step) {
    return _prosemirrorTransform.Step.fromJSON(schema, step);
  });
  var tr;

  if (options && options.useNativePlugin && userIds) {
    tr = (0, _prosemirrorCollab.receiveTransaction)(state, steps, userIds);
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

    var _json = (0, _slicedToArray2.default)(json, 1),
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

exports.applyRemoteSteps = applyRemoteSteps;

var handleTelePointer = function handleTelePointer(telepointerData, view) {
  var tr = view.state.tr;
  view.dispatch(tr.setMeta('telepointer', telepointerData));
};

exports.handleTelePointer = handleTelePointer;

function isAllSelection(selection) {
  return selection instanceof _prosemirrorState.AllSelection;
}

function isNodeSelection(selection) {
  return selection instanceof _prosemirrorState.NodeSelection;
}

var getSendableSelection = function getSendableSelection(selection) {
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

exports.getSendableSelection = getSendableSelection;