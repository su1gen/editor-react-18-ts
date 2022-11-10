import { LIST_TEXT_SCENARIOS } from '../../analytics';
import { isParagraphNode, isListNode, isListItemNode } from '../utils/node';
import { isPosInsideList, isPosInsideParagraph } from '../utils/selection';
import { joinParagrapWithList, joinSiblingListItems, joinNestedListWithParentListItem, joinListItemWithParentNestedList, joinListItemWithParagraph } from './join-list-items-scenarios';
export var calcJoinListScenario = function calcJoinListScenario(walkNode, $head) {
  var $next = walkNode.$pos,
      nextFoundNode = walkNode.foundNode;
  var headParent = $head.parent;
  var headGrandParent = $head.node(-1);
  var headInList = isPosInsideList($head);
  var headInParagraph = isPosInsideParagraph($head);
  var headInLastNonListChild = headGrandParent && headGrandParent.lastChild && (headGrandParent.lastChild === headParent || headGrandParent.childCount > 1 && headGrandParent.child(headGrandParent.childCount - 2) === headParent && //find the second last child if a list item may be the last child
  isListNode(headGrandParent.lastChild));
  var nextInList = isPosInsideList($next);
  var nextInParagraph = isPosInsideParagraph($next);

  if (!headInList && headInParagraph && nextInList) {
    return [LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH, joinListItemWithParagraph];
  }

  if (!nextFoundNode || !headInList || !headInParagraph || !headInLastNonListChild) {
    return false;
  }

  if (!nextInList && nextInParagraph) {
    return [LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST, joinParagrapWithList];
  }

  if (!nextInList) {
    return false;
  }

  var nextNodeAfter = $next.nodeAfter;
  var nextGrandParent = $next.node(-1);
  var headGreatGrandParent = $head.node(-2);
  var nextInListItem = isListItemNode($next.parent);
  var nextNodeAfterListItem = isListItemNode(nextNodeAfter);
  var nextListItemHasFirstChildParagraph = nextNodeAfter && //Redundant check but the linter complains otherwise
  nextNodeAfterListItem && isParagraphNode(nextNodeAfter.firstChild);

  if (!nextInListItem && nextListItemHasFirstChildParagraph) {
    return [LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT, joinNestedListWithParentListItem];
  }

  if (!nextInListItem) {
    return false;
  }

  var nextParentSiblingOfHeadParent = nextGrandParent && nextGrandParent === headGreatGrandParent;
  var nextNodeAfterIsParagraph = isParagraphNode(nextNodeAfter);

  if (!nextNodeAfterIsParagraph) {
    return false;
  }

  if (nextParentSiblingOfHeadParent) {
    return [LIST_TEXT_SCENARIOS.JOIN_SIBLINGS, joinSiblingListItems];
  }

  return [LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD, joinListItemWithParentNestedList];
};