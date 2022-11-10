"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetShouldIgnoreFollowingMutations = exports.resetCopiedState = exports.removeCodeBlock = exports.ignoreFollowingMutations = exports.copyContentToClipboard = exports.changeLanguage = void 0;

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorState = require("prosemirror-state");

var _pluginKey = require("./plugin-key");

var _codeBlockCopySelectionPlugin = require("./pm-plugins/codeBlockCopySelectionPlugin");

var _actions = require("./pm-plugins/actions");

var _clipboard = require("../../utils/clipboard");

var _utils = require("../analytics/utils");

var _types = require("../analytics/types");

var removeCodeBlock = function removeCodeBlock(state, dispatch) {
  var nodes = state.schema.nodes,
      tr = state.tr;

  if (dispatch) {
    var removeTr = tr;

    if ((0, _prosemirrorUtils.findSelectedNodeOfType)(nodes.codeBlock)(tr.selection)) {
      removeTr = (0, _prosemirrorUtils.removeSelectedNode)(tr);
    } else {
      removeTr = (0, _prosemirrorUtils.removeParentNodeOfType)(nodes.codeBlock)(tr);
    }

    dispatch(removeTr);
  }

  return true;
};

exports.removeCodeBlock = removeCodeBlock;

var changeLanguage = function changeLanguage(language) {
  return function (state, dispatch) {
    var _pluginKey$getState;

    var codeBlock = state.schema.nodes.codeBlock;
    var pos = (_pluginKey$getState = _pluginKey.pluginKey.getState(state)) === null || _pluginKey$getState === void 0 ? void 0 : _pluginKey$getState.pos;

    if (typeof pos !== 'number') {
      return false;
    }

    var tr = state.tr.setNodeMarkup(pos, codeBlock, {
      language: language
    }).setMeta('scrollIntoView', false);
    var selection = (0, _prosemirrorUtils.isNodeSelection)(state.selection) ? _prosemirrorState.NodeSelection.create(tr.doc, pos) : tr.selection;
    var result = tr.setSelection(selection);

    if (dispatch) {
      dispatch((0, _utils.addAnalytics)(state, result, {
        action: _types.ACTION.LANGUAGE_SELECTED,
        actionSubject: _types.ACTION_SUBJECT.CODE_BLOCK,
        attributes: {
          language: language
        },
        eventType: _types.EVENT_TYPE.TRACK
      }));
    }

    return true;
  };
};

exports.changeLanguage = changeLanguage;

var copyContentToClipboard = function copyContentToClipboard(state, dispatch) {
  var nodes = state.schema.nodes,
      tr = state.tr;
  var codeBlock = (0, _prosemirrorUtils.findParentNodeOfType)(nodes.codeBlock)(tr.selection);
  var textContent = codeBlock && codeBlock.node.textContent;

  if (textContent) {
    (0, _clipboard.copyToClipboard)(textContent);
    var copyToClipboardTr = tr;
    copyToClipboardTr.setMeta(_pluginKey.pluginKey, {
      type: _actions.ACTIONS.SET_COPIED_TO_CLIPBOARD,
      data: true
    });
    copyToClipboardTr.setMeta(_codeBlockCopySelectionPlugin.copySelectionPluginKey, 'remove-selection');

    if (dispatch) {
      dispatch(copyToClipboardTr);
    }
  }

  return true;
};

exports.copyContentToClipboard = copyContentToClipboard;

var resetCopiedState = function resetCopiedState(state, dispatch) {
  var tr = state.tr;

  var codeBlockState = _pluginKey.pluginKey.getState(state);

  var resetCopiedStateTr = tr;

  if (codeBlockState && codeBlockState.contentCopied) {
    resetCopiedStateTr.setMeta(_pluginKey.pluginKey, {
      type: _actions.ACTIONS.SET_COPIED_TO_CLIPBOARD,
      data: false
    });
    resetCopiedStateTr.setMeta(_codeBlockCopySelectionPlugin.copySelectionPluginKey, 'remove-selection');

    if (dispatch) {
      dispatch(resetCopiedStateTr);
    }
  } else {
    var clearSelectionStateTransaction = state.tr;
    clearSelectionStateTransaction.setMeta(_codeBlockCopySelectionPlugin.copySelectionPluginKey, 'remove-selection'); // note: dispatch should always be defined when called from the
    // floating toolbar. Howver the Command type which floating toolbar uses
    // (and resetCopiedState) uses suggests it's optional.

    if (dispatch) {
      dispatch(clearSelectionStateTransaction);
    }
  }

  return true;
};

exports.resetCopiedState = resetCopiedState;

var ignoreFollowingMutations = function ignoreFollowingMutations(state, dispatch) {
  var tr = state.tr;
  var ignoreFollowingMutationsTr = tr;
  ignoreFollowingMutationsTr.setMeta(_pluginKey.pluginKey, {
    type: _actions.ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS,
    data: true
  });

  if (dispatch) {
    dispatch(ignoreFollowingMutationsTr);
  }

  return true;
};

exports.ignoreFollowingMutations = ignoreFollowingMutations;

var resetShouldIgnoreFollowingMutations = function resetShouldIgnoreFollowingMutations(state, dispatch) {
  var tr = state.tr;
  var ignoreFollowingMutationsTr = tr;
  ignoreFollowingMutationsTr.setMeta(_pluginKey.pluginKey, {
    type: _actions.ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS,
    data: false
  });

  if (dispatch) {
    dispatch(ignoreFollowingMutationsTr);
  }

  return true;
};

exports.resetShouldIgnoreFollowingMutations = resetShouldIgnoreFollowingMutations;