import { findParentNodeOfType, findSelectedNodeOfType, removeSelectedNode, removeParentNodeOfType, isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { pluginKey } from './plugin-key';
import { copySelectionPluginKey } from './pm-plugins/codeBlockCopySelectionPlugin';
import { ACTIONS } from './pm-plugins/actions';
import { copyToClipboard } from '../../utils/clipboard';
import { addAnalytics } from '../analytics/utils';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics/types';
export var removeCodeBlock = function removeCodeBlock(state, dispatch) {
  var nodes = state.schema.nodes,
      tr = state.tr;

  if (dispatch) {
    var removeTr = tr;

    if (findSelectedNodeOfType(nodes.codeBlock)(tr.selection)) {
      removeTr = removeSelectedNode(tr);
    } else {
      removeTr = removeParentNodeOfType(nodes.codeBlock)(tr);
    }

    dispatch(removeTr);
  }

  return true;
};
export var changeLanguage = function changeLanguage(language) {
  return function (state, dispatch) {
    var _pluginKey$getState;

    var codeBlock = state.schema.nodes.codeBlock;
    var pos = (_pluginKey$getState = pluginKey.getState(state)) === null || _pluginKey$getState === void 0 ? void 0 : _pluginKey$getState.pos;

    if (typeof pos !== 'number') {
      return false;
    }

    var tr = state.tr.setNodeMarkup(pos, codeBlock, {
      language: language
    }).setMeta('scrollIntoView', false);
    var selection = isNodeSelection(state.selection) ? NodeSelection.create(tr.doc, pos) : tr.selection;
    var result = tr.setSelection(selection);

    if (dispatch) {
      dispatch(addAnalytics(state, result, {
        action: ACTION.LANGUAGE_SELECTED,
        actionSubject: ACTION_SUBJECT.CODE_BLOCK,
        attributes: {
          language: language
        },
        eventType: EVENT_TYPE.TRACK
      }));
    }

    return true;
  };
};
export var copyContentToClipboard = function copyContentToClipboard(state, dispatch) {
  var nodes = state.schema.nodes,
      tr = state.tr;
  var codeBlock = findParentNodeOfType(nodes.codeBlock)(tr.selection);
  var textContent = codeBlock && codeBlock.node.textContent;

  if (textContent) {
    copyToClipboard(textContent);
    var copyToClipboardTr = tr;
    copyToClipboardTr.setMeta(pluginKey, {
      type: ACTIONS.SET_COPIED_TO_CLIPBOARD,
      data: true
    });
    copyToClipboardTr.setMeta(copySelectionPluginKey, 'remove-selection');

    if (dispatch) {
      dispatch(copyToClipboardTr);
    }
  }

  return true;
};
export var resetCopiedState = function resetCopiedState(state, dispatch) {
  var tr = state.tr;
  var codeBlockState = pluginKey.getState(state);
  var resetCopiedStateTr = tr;

  if (codeBlockState && codeBlockState.contentCopied) {
    resetCopiedStateTr.setMeta(pluginKey, {
      type: ACTIONS.SET_COPIED_TO_CLIPBOARD,
      data: false
    });
    resetCopiedStateTr.setMeta(copySelectionPluginKey, 'remove-selection');

    if (dispatch) {
      dispatch(resetCopiedStateTr);
    }
  } else {
    var clearSelectionStateTransaction = state.tr;
    clearSelectionStateTransaction.setMeta(copySelectionPluginKey, 'remove-selection'); // note: dispatch should always be defined when called from the
    // floating toolbar. Howver the Command type which floating toolbar uses
    // (and resetCopiedState) uses suggests it's optional.

    if (dispatch) {
      dispatch(clearSelectionStateTransaction);
    }
  }

  return true;
};
export var ignoreFollowingMutations = function ignoreFollowingMutations(state, dispatch) {
  var tr = state.tr;
  var ignoreFollowingMutationsTr = tr;
  ignoreFollowingMutationsTr.setMeta(pluginKey, {
    type: ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS,
    data: true
  });

  if (dispatch) {
    dispatch(ignoreFollowingMutationsTr);
  }

  return true;
};
export var resetShouldIgnoreFollowingMutations = function resetShouldIgnoreFollowingMutations(state, dispatch) {
  var tr = state.tr;
  var ignoreFollowingMutationsTr = tr;
  ignoreFollowingMutationsTr.setMeta(pluginKey, {
    type: ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS,
    data: false
  });

  if (dispatch) {
    dispatch(ignoreFollowingMutationsTr);
  }

  return true;
};