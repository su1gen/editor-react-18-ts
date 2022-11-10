import { removeParentNodeOfType, findSelectedNodeOfType, removeSelectedNode, findParentNodeOfType } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, addAnalytics } from '../analytics';
import { findPanel } from './utils';
import { getPanelTypeBackground } from '@atlaskit/editor-common/panel';
export const removePanel = () => (state, dispatch) => {
  const {
    schema: {
      nodes
    },
    tr
  } = state;
  const payload = {
    action: ACTION.DELETED,
    actionSubject: ACTION_SUBJECT.PANEL,
    attributes: {
      inputMethod: INPUT_METHOD.TOOLBAR
    },
    eventType: EVENT_TYPE.TRACK
  };
  let deleteTr = tr;

  if (findSelectedNodeOfType(nodes.panel)(tr.selection)) {
    deleteTr = removeSelectedNode(tr);
  } else if (findParentNodeOfType(nodes.panel)(tr.selection)) {
    deleteTr = removeParentNodeOfType(nodes.panel)(tr);
  }

  if (!deleteTr) {
    return false;
  }

  if (dispatch) {
    dispatch(addAnalytics(state, deleteTr, payload));
  }

  return true;
};
export const changePanelType = (panelType, panelOptions = {}, allowCustomPanel = false) => (state, dispatch) => {
  const {
    schema: {
      nodes
    },
    tr
  } = state;
  const panelNode = findPanel(state);

  if (panelNode === undefined) {
    return false;
  }

  let newType = panelType;
  let previousType = panelNode.node.attrs.panelType;
  let newTr;

  if (allowCustomPanel) {
    let previousColor = panelNode.node.attrs.panelColor || getPanelTypeBackground(previousType);
    let previousIcon = panelNode.node.attrs.panelIcon;
    let previousIconId = panelNode.node.attrs.panelIconId;
    let previousIconText = panelNode.node.attrs.panelIconText;
    let newPanelOptions = {
      color: previousColor,
      emoji: previousIcon,
      emojiId: previousIconId,
      emojiText: previousIconText,
      ...panelOptions
    };
    newTr = tr.setNodeMarkup(panelNode.pos, nodes.panel, {
      panelIcon: newPanelOptions.emoji,
      panelIconId: newPanelOptions.emojiId,
      panelIconText: newPanelOptions.emojiText,
      panelColor: newPanelOptions.color,
      panelType
    });
  } else {
    newTr = tr.setNodeMarkup(panelNode.pos, nodes.panel, {
      panelType
    });
  }

  const payload = {
    action: ACTION.CHANGED_TYPE,
    actionSubject: ACTION_SUBJECT.PANEL,
    attributes: {
      newType,
      previousType
    },
    eventType: EVENT_TYPE.TRACK
  }; // Select the panel if it was previously selected

  const newTrWithSelection = state.selection instanceof NodeSelection && state.selection.node.type.name === 'panel' ? newTr.setSelection(new NodeSelection(tr.doc.resolve(panelNode.pos))) : newTr;
  const changePanelTypeTr = addAnalytics(state, newTrWithSelection, payload);
  changePanelTypeTr.setMeta('scrollIntoView', false);

  if (dispatch) {
    dispatch(changePanelTypeTr);
  }

  return true;
};