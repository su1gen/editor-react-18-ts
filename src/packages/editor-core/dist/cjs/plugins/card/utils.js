"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformUnsupportedBlockCardToInline = exports.titleUrlPairFromNode = exports.selectedCardAppearance = exports.mergeCardInfo = exports.findCardInfo = exports.displayInfoForCard = exports.appearanceForNodeType = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorModel = require("prosemirror-model");

var _pluginKey = require("./pm-plugins/plugin-key");

var _slice = require("../../utils/slice");

var _nodes = require("../..//utils/nodes");

var appearanceForNodeType = function appearanceForNodeType(spec) {
  if (spec.name === 'inlineCard') {
    return 'inline';
  } else if (spec.name === 'blockCard') {
    return 'block';
  } else if (spec.name === 'embedCard') {
    return 'embed';
  }

  return;
};

exports.appearanceForNodeType = appearanceForNodeType;

var selectedCardAppearance = function selectedCardAppearance(state) {
  return state.selection instanceof _prosemirrorState.NodeSelection && appearanceForNodeType(state.selection.node.type);
};

exports.selectedCardAppearance = selectedCardAppearance;

var titleUrlPairFromNode = function titleUrlPairFromNode(node) {
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


exports.titleUrlPairFromNode = titleUrlPairFromNode;

var mergeCardInfo = function mergeCardInfo(titleUrlPair, info) {
  return {
    title: info && info.title || titleUrlPair.title,
    url: info && info.url || titleUrlPair.url
  };
};

exports.mergeCardInfo = mergeCardInfo;

var displayInfoForCard = function displayInfoForCard(node, info) {
  return mergeCardInfo(titleUrlPairFromNode(node), info);
};

exports.displayInfoForCard = displayInfoForCard;

var findCardInfo = function findCardInfo(state) {
  var pluginState = _pluginKey.pluginKey.getState(state);

  return pluginState.cards.find(function (cardInfo) {
    return cardInfo.pos === state.selection.from;
  });
};

exports.findCardInfo = findCardInfo;

var transformUnsupportedBlockCardToInline = function transformUnsupportedBlockCardToInline(slice, state) {
  var _state$schema$nodes = state.schema.nodes,
      blockCard = _state$schema$nodes.blockCard,
      inlineCard = _state$schema$nodes.inlineCard;
  var children = [];
  (0, _slice.mapChildren)(slice.content, function (node, i, frag) {
    if (node.type === blockCard && !(0, _nodes.isSupportedInParent)(state, frag)) {
      children.push(inlineCard.createChecked(node.attrs, node.content, node.marks));
    } else {
      children.push(node);
    }
  });
  return new _prosemirrorModel.Slice(_prosemirrorModel.Fragment.fromArray(children), slice.openStart, slice.openEnd);
};

exports.transformUnsupportedBlockCardToInline = transformUnsupportedBlockCardToInline;