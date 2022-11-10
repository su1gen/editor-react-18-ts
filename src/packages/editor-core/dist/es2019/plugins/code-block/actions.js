import { findParentNodeOfType, findSelectedNodeOfType, removeSelectedNode, removeParentNodeOfType, isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { pluginKey } from './plugin-key';
import { copySelectionPluginKey } from './pm-plugins/codeBlockCopySelectionPlugin';
import { ACTIONS } from './pm-plugins/actions';
import { copyToClipboard } from '../../utils/clipboard';
import { addAnalytics } from '../analytics/utils';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics/types';
export const removeCodeBlock = (state, dispatch) => {
  const {
    schema: {
      nodes
    },
    tr
  } = state;

  if (dispatch) {
    let removeTr = tr;

    if (findSelectedNodeOfType(nodes.codeBlock)(tr.selection)) {
      removeTr = removeSelectedNode(tr);
    } else {
      removeTr = removeParentNodeOfType(nodes.codeBlock)(tr);
    }

    dispatch(removeTr);
  }

  return true;
};
export const changeLanguage = language => (state, dispatch) => {
  var _pluginKey$getState;

  const {
    codeBlock
  } = state.schema.nodes;
  const pos = (_pluginKey$getState = pluginKey.getState(state)) === null || _pluginKey$getState === void 0 ? void 0 : _pluginKey$getState.pos;

  if (typeof pos !== 'number') {
    return false;
  }

  const tr = state.tr.setNodeMarkup(pos, codeBlock, {
    language
  }).setMeta('scrollIntoView', false);
  const selection = isNodeSelection(state.selection) ? NodeSelection.create(tr.doc, pos) : tr.selection;
  const result = tr.setSelection(selection);

  if (dispatch) {
    dispatch(addAnalytics(state, result, {
      action: ACTION.LANGUAGE_SELECTED,
      actionSubject: ACTION_SUBJECT.CODE_BLOCK,
      attributes: {
        language
      },
      eventType: EVENT_TYPE.TRACK
    }));
  }

  return true;
};
export const copyContentToClipboard = (state, dispatch) => {
  const {
    schema: {
      nodes
    },
    tr
  } = state;
  const codeBlock = findParentNodeOfType(nodes.codeBlock)(tr.selection);
  const textContent = codeBlock && codeBlock.node.textContent;

  if (textContent) {
    copyToClipboard(textContent);
    let copyToClipboardTr = tr;
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
export const resetCopiedState = (state, dispatch) => {
  const {
    tr
  } = state;
  const codeBlockState = pluginKey.getState(state);
  let resetCopiedStateTr = tr;

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
    const clearSelectionStateTransaction = state.tr;
    clearSelectionStateTransaction.setMeta(copySelectionPluginKey, 'remove-selection'); // note: dispatch should always be defined when called from the
    // floating toolbar. Howver the Command type which floating toolbar uses
    // (and resetCopiedState) uses suggests it's optional.

    if (dispatch) {
      dispatch(clearSelectionStateTransaction);
    }
  }

  return true;
};
export const ignoreFollowingMutations = (state, dispatch) => {
  const {
    tr
  } = state;
  const ignoreFollowingMutationsTr = tr;
  ignoreFollowingMutationsTr.setMeta(pluginKey, {
    type: ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS,
    data: true
  });

  if (dispatch) {
    dispatch(ignoreFollowingMutationsTr);
  }

  return true;
};
export const resetShouldIgnoreFollowingMutations = (state, dispatch) => {
  const {
    tr
  } = state;
  const ignoreFollowingMutationsTr = tr;
  ignoreFollowingMutationsTr.setMeta(pluginKey, {
    type: ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS,
    data: false
  });

  if (dispatch) {
    dispatch(ignoreFollowingMutationsTr);
  }

  return true;
};