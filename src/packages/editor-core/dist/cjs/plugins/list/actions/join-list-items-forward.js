"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcJoinListScenario = void 0;

var _analytics = require("../../analytics");

var _node = require("../utils/node");

var _selection = require("../utils/selection");

var _joinListItemsScenarios = require("./join-list-items-scenarios");

var calcJoinListScenario = function calcJoinListScenario(walkNode, $head) {
  var $next = walkNode.$pos,
      nextFoundNode = walkNode.foundNode;
  var headParent = $head.parent;
  var headGrandParent = $head.node(-1);
  var headInList = (0, _selection.isPosInsideList)($head);
  var headInParagraph = (0, _selection.isPosInsideParagraph)($head);
  var headInLastNonListChild = headGrandParent && headGrandParent.lastChild && (headGrandParent.lastChild === headParent || headGrandParent.childCount > 1 && headGrandParent.child(headGrandParent.childCount - 2) === headParent && //find the second last child if a list item may be the last child
  (0, _node.isListNode)(headGrandParent.lastChild));
  var nextInList = (0, _selection.isPosInsideList)($next);
  var nextInParagraph = (0, _selection.isPosInsideParagraph)($next);

  if (!headInList && headInParagraph && nextInList) {
    return [_analytics.LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH, _joinListItemsScenarios.joinListItemWithParagraph];
  }

  if (!nextFoundNode || !headInList || !headInParagraph || !headInLastNonListChild) {
    return false;
  }

  if (!nextInList && nextInParagraph) {
    return [_analytics.LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST, _joinListItemsScenarios.joinParagrapWithList];
  }

  if (!nextInList) {
    return false;
  }

  var nextNodeAfter = $next.nodeAfter;
  var nextGrandParent = $next.node(-1);
  var headGreatGrandParent = $head.node(-2);
  var nextInListItem = (0, _node.isListItemNode)($next.parent);
  var nextNodeAfterListItem = (0, _node.isListItemNode)(nextNodeAfter);
  var nextListItemHasFirstChildParagraph = nextNodeAfter && //Redundant check but the linter complains otherwise
  nextNodeAfterListItem && (0, _node.isParagraphNode)(nextNodeAfter.firstChild);

  if (!nextInListItem && nextListItemHasFirstChildParagraph) {
    return [_analytics.LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT, _joinListItemsScenarios.joinNestedListWithParentListItem];
  }

  if (!nextInListItem) {
    return false;
  }

  var nextParentSiblingOfHeadParent = nextGrandParent && nextGrandParent === headGreatGrandParent;
  var nextNodeAfterIsParagraph = (0, _node.isParagraphNode)(nextNodeAfter);

  if (!nextNodeAfterIsParagraph) {
    return false;
  }

  if (nextParentSiblingOfHeadParent) {
    return [_analytics.LIST_TEXT_SCENARIOS.JOIN_SIBLINGS, _joinListItemsScenarios.joinSiblingListItems];
  }

  return [_analytics.LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD, _joinListItemsScenarios.joinListItemWithParentNestedList];
};

exports.calcJoinListScenario = calcJoinListScenario;