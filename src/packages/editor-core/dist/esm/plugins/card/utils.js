import { NodeSelection } from 'prosemirror-state';
import { Slice, Fragment } from 'prosemirror-model';
import { pluginKey } from './pm-plugins/plugin-key';
import { mapChildren } from '../../utils/slice';
import { isSupportedInParent } from '../..//utils/nodes';
export var appearanceForNodeType = function appearanceForNodeType(spec) {
  if (spec.name === 'inlineCard') {
    return 'inline';
  } else if (spec.name === 'blockCard') {
    return 'block';
  } else if (spec.name === 'embedCard') {
    return 'embed';
  }

  return;
};
export var selectedCardAppearance = function selectedCardAppearance(state) {
  return state.selection instanceof NodeSelection && appearanceForNodeType(state.selection.node.type);
};
export var titleUrlPairFromNode = function titleUrlPairFromNode(node) {
  var attrs = node.attrs;
  return {
    url: attrs.url || attrs.data && attrs.data.url,
    title: attrs.data && attrs.data.title
  };
};
/**
 * Merges the title and url from attributes and CardInfo from the resolved view, preferring the CardInfo.
 * @param titleUrlPair title and url information from the node attributes
 * @param info information stored in state from the resolved UI component view
 */

export var mergeCardInfo = function mergeCardInfo(titleUrlPair, info) {
  return {
    title: info && info.title || titleUrlPair.title,
    url: info && info.url || titleUrlPair.url
  };
};
export var displayInfoForCard = function displayInfoForCard(node, info) {
  return mergeCardInfo(titleUrlPairFromNode(node), info);
};
export var findCardInfo = function findCardInfo(state) {
  var pluginState = pluginKey.getState(state);
  return pluginState.cards.find(function (cardInfo) {
    return cardInfo.pos === state.selection.from;
  });
};
export var transformUnsupportedBlockCardToInline = function transformUnsupportedBlockCardToInline(slice, state) {
  var _state$schema$nodes = state.schema.nodes,
      blockCard = _state$schema$nodes.blockCard,
      inlineCard = _state$schema$nodes.inlineCard;
  var children = [];
  mapChildren(slice.content, function (node, i, frag) {
    if (node.type === blockCard && !isSupportedInParent(state, frag)) {
      children.push(inlineCard.createChecked(node.attrs, node.content, node.marks));
    } else {
      children.push(node);
    }
  });
  return new Slice(Fragment.fromArray(children), slice.openStart, slice.openEnd);
};