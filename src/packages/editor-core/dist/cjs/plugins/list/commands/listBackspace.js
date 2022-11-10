"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listBackspace = exports.calcJoinListScenario = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _commands = require("../../../utils/commands");

var _analytics = require("../../analytics");

var _prosemirrorUtils = require("prosemirror-utils");

var _node = require("../utils/node");

var _selection = require("../utils/selection");

var _BACKSPACE_COMMANDS;

//Cases below refer to the cases found in this document: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1146954996/List+Backspace+and+Delete+Behaviour
//Case for two adjacent list items of the same indentation
var listBackspaceCase2 = function listBackspaceCase2(tr, dispatch, $prev, $head) {
  /* CASE 2
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |textInsertPos| }       //Cant have children since that would be Case 4
   *   |$prev||childrenGInsertPos| }
   *   ListItem E {
   *     Paragraph F { |$head| text2 }
   *     ...Children G
   *   }
   * }
   *
   * Converts to:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph C { text1text2 }
   *     ...Children G
   *   }
   * }
   *
   */
  var listItemE = $head.node(-1); //Head is inside listItem E so it must have a first and last child

  if (!listItemE.firstChild) {
    return false;
  }

  var beforeListItemE = $head.before(-1);
  var afterListItemE = $head.after(-1);
  var textInsertPos = $prev.pos - 1; //Paragraph D must be directly behind $prev otherwise it would be case 4

  var childrenGInsertPos = $prev.pos;
  var textContent = $head.parent.content;
  var childrenGContent = listItemE.content.cut(listItemE.firstChild.nodeSize);
  (0, _commands.insertContentDeleteRange)(tr, function (tr) {
    return tr.doc.resolve(textInsertPos);
  }, [[textContent, textInsertPos], [childrenGContent, childrenGInsertPos]], [[beforeListItemE, afterListItemE]]);

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}; //Case for two adjacent list items with the first being of lower indentation


var listBackspaceCase3 = function listBackspaceCase3(tr, dispatch, $prev, $head) {
  /* CASE 3
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |$prev||textInsertPos| } |childrenHInsertPos|
   *     List E { |childrenJInsertPos|
   *       ListItem F {
   *         Paragraph G { |$head| text2 }
   *         ...Children H
   *         List? I {
   *           ...Children J
   *         }
   *       }
   *       ...Children K
   *     }
   *   }
   * }
   *
   * Converts to:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1text2 }
   *     ...Children H
   *     List E {
   *       ...Children J
   *       ...Children K
   *     }
   *   }
   * }
   *
   */
  var listE = $head.node(-2);
  var listItemF = $head.node(-1); //Head is inside listItem F so it must have a first and last child

  if (!listItemF.firstChild || !listItemF.lastChild) {
    return false;
  }

  var beforeListE = $head.before(-2);
  var beforeListItemF = $head.before(-1);
  var afterParagraphD = $prev.after();
  var afterListE = $head.after(-2);
  var afterListItemF = $head.after(-1);
  var startListE = $head.start(-2);
  var containsChildrenJ = (0, _node.isListNode)(listItemF.lastChild);
  var shouldRemoveListE = listE.childCount === 1 && !containsChildrenJ; //Assures no Children J and K

  var textInsertPos = $prev.pos;
  var childrenHInsertPos = afterParagraphD;
  var childrenJInsertPos = startListE;
  var textContent = $head.parent.content;
  var childrenHContent = containsChildrenJ ? listItemF.content.cut(listItemF.firstChild.nodeSize, listItemF.nodeSize - listItemF.lastChild.nodeSize - 2) : listItemF.content.cut(listItemF.firstChild.nodeSize); //If Children J doesn't exist then Children H will include the last node

  var childrenJContent = listItemF.lastChild.content; //Will be invalid if there are no Children J but it will be unused

  (0, _commands.insertContentDeleteRange)(tr, function (tr) {
    return tr.doc.resolve(textInsertPos);
  }, containsChildrenJ ? [[textContent, textInsertPos], [childrenHContent, childrenHInsertPos], [childrenJContent, childrenJInsertPos]] : [[textContent, textInsertPos], [childrenHContent, childrenHInsertPos]], [shouldRemoveListE ? [beforeListE, afterListE] : [beforeListItemF, afterListItemF]]);

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}; //Case for two adjacent list items with the first being of greater indentation


var listBackspaceCase4 = function listBackspaceCase4(tr, dispatch, $prev, $head, $last) {
  /* CASE 4
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     Paragraph C { text1 }
   *     ...Children D
   *     List E {
   *       ...
   *         List F {       //May be multiple levels of lists
   *           ...Children G
   *           ListItem H {        //Last node of the block
   *             ...Children I
   *             Paragraph J { text2 |$last||textInsertPos| } |childrenMInsertPos|        //Cant have children since this ListItem is the last of the block
   *           }
   *         }
   *       ...
   *     |childrenOInsertPosition| }
   *   |$prev| }
   *   ListItem K {
   *      Paragraph L { |$head| text3 }
   *      ...Children M
   *      List? N {
   *       ...Children O
   *      }
   *   }
   * }
   *
   * Converts to:
   *
   * List A {
   *   ListItem B {
   *     Paragraph C { text1 }
   *     ...Children D
   *     List E {
   *       ...
   *         List F {
   *           ...Children G
   *           ListItem H {
   *             ...Children I
   *             Paragraph J { text2text3 }
   *             ...Children M
   *           }
   *         }
   *       ...
   *       ...Children O
   *     }
   *   }
   * }
   *
   */
  if (!$last) {
    //Exit if an invalid last was given as a parameter
    return false;
  }

  var listItemK = $head.node(-1); //Head is inside listItem K so it must have a first and last child

  if (!listItemK.firstChild || !listItemK.lastChild) {
    return false;
  }

  var paragraphL = $head.parent;
  var beforeListItemK = $head.before(-1);
  var afterParagraphJ = $last.after();
  var afterListItemK = $head.after(-1);
  var containsChildrenO = (0, _node.isListNode)(listItemK.lastChild);
  var textInsertPos = $last.pos;
  var childrenMInsertPos = afterParagraphJ;
  var childrenOInsertPos = $prev.pos - 1; //Last item of listItem B must be a list therefore we can simply decrement $prev to get there

  var textContent = paragraphL.content;
  var childrenMContent = containsChildrenO ? listItemK.content.cut(listItemK.firstChild.nodeSize, listItemK.nodeSize - listItemK.lastChild.nodeSize - 2) : listItemK.content.cut(listItemK.firstChild.nodeSize);
  var childrenOContent = listItemK.lastChild.content;
  (0, _commands.insertContentDeleteRange)(tr, function (tr) {
    return tr.doc.resolve(textInsertPos);
  }, containsChildrenO ? [[textContent, textInsertPos], [childrenMContent, childrenMInsertPos], [childrenOContent, childrenOInsertPos]] : [[textContent, textInsertPos], [childrenMContent, childrenMInsertPos]], [[beforeListItemK, afterListItemK]]);

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

var BACKSPACE_COMMANDS = (_BACKSPACE_COMMANDS = {}, (0, _defineProperty2.default)(_BACKSPACE_COMMANDS, _analytics.LIST_TEXT_SCENARIOS.JOIN_SIBLINGS, listBackspaceCase2), (0, _defineProperty2.default)(_BACKSPACE_COMMANDS, _analytics.LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT, listBackspaceCase3), (0, _defineProperty2.default)(_BACKSPACE_COMMANDS, _analytics.LIST_TEXT_SCENARIOS.JOIN_TO_SIBLING_DESCENDANT, listBackspaceCase4), _BACKSPACE_COMMANDS);

var calcJoinListScenario = function calcJoinListScenario(walkNode, $head, tr) {
  var $prev = walkNode.$pos,
      prevFoundNode = walkNode.foundNode;
  var prevInList = (0, _selection.isPosInsideList)($prev);
  var headInParagraph = (0, _selection.isPosInsideParagraph)($head);
  var headInFirstChild = $head.index(-1) === 0;
  var headInList = (0, _selection.isPosInsideList)($head); //Must be at the start of the selection of the first child in the listItem

  if (!prevFoundNode || !prevInList || !headInParagraph || !headInFirstChild || !headInList) {
    return false;
  }

  var prevInParagraph = (0, _selection.isPosInsideParagraph)($prev);

  if (prevInParagraph) {
    return [_analytics.LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT, null];
  }

  var prevParentLastChildIsList = $prev.parent.lastChild && (0, _node.isListNode)($prev.parent.lastChild);
  var prevParentLastChildIsParagraph = (0, _node.isParagraphNode)($prev.parent.lastChild); // Will search for the possible last node for case 4 (where the list could be indented multiple times)
  // $last is required to determine whether we are in case 2 or 4

  var $last = tr.doc.resolve($prev.pos);
  var lastFoundNode;

  do {
    var _walkNode = (0, _commands.walkPrevNode)($last);

    $last = _walkNode.$pos;
    lastFoundNode = _walkNode.foundNode;
  } while (lastFoundNode && !$last.parent.isTextblock);

  var lastInParagraph = (0, _selection.isPosInsideParagraph)($last);

  if (lastFoundNode && prevParentLastChildIsList && lastInParagraph) {
    return [_analytics.LIST_TEXT_SCENARIOS.JOIN_TO_SIBLING_DESCENDANT, $last];
  } else if (prevParentLastChildIsParagraph) {
    return [_analytics.LIST_TEXT_SCENARIOS.JOIN_SIBLINGS, null];
  }

  return false;
};

exports.calcJoinListScenario = calcJoinListScenario;

var listBackspace = function listBackspace(state, dispatch) {
  var tr = state.tr,
      $head = state.selection.$head;
  var walkNode = (0, _commands.walkPrevNode)($head);

  if (!(0, _commands.isEmptySelectionAtStart)(state)) {
    return false;
  }

  var scenario = calcJoinListScenario(walkNode, $head, tr);

  if (!scenario) {
    return false;
  }

  var _state$schema$nodes = state.schema.nodes,
      bulletList = _state$schema$nodes.bulletList,
      orderedList = _state$schema$nodes.orderedList;
  var listParent = (0, _prosemirrorUtils.findParentNodeOfType)([bulletList, orderedList])(tr.selection);
  var actionSubjectId = _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_BULLET;

  if (listParent && listParent.node.type === orderedList) {
    actionSubjectId = _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
  }

  (0, _analytics.addAnalytics)(state, tr, {
    action: _analytics.ACTION.LIST_ITEM_JOINED,
    actionSubject: _analytics.ACTION_SUBJECT.LIST,
    actionSubjectId: actionSubjectId,
    eventType: _analytics.EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.KEYBOARD,
      direction: _analytics.DELETE_DIRECTION.BACKWARD,
      scenario: scenario[0]
    }
  });
  return BACKSPACE_COMMANDS[scenario[0]](tr, dispatch, walkNode.$pos, $head, scenario[1]);
};

exports.listBackspace = listBackspace;