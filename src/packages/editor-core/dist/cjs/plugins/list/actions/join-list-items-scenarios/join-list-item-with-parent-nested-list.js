"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinListItemWithParentNestedList = void 0;

var _commands = require("../../../../utils/commands");

var _node = require("../../utils/node");

//Case for two adjacent list items with the first being of greater indentation
var joinListItemWithParentNestedList = function joinListItemWithParentNestedList(_ref) {
  var tr = _ref.tr,
      $next = _ref.$next,
      $head = _ref.$head;

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
   *             Paragraph J { text2 |$head||textInsertPos| } |childrenMInsertPos|        //Cant have children since this ListItem is the last of the block
   *           }
   *         }
   *       ...
   *     |childrenOInsertPos| }
   *   }
   *   ListItem K { |$next|
   *      Paragraph L { text3 }
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
  var listItemK = $next.parent; //List must have at least one child

  if (!listItemK.firstChild || !listItemK.lastChild) {
    return false;
  }

  var beforeListItemK = $next.before();
  var afterListItemB = $next.before();
  var afterListItemK = $next.after();
  var containsChildrenO = (0, _node.isListNode)(listItemK.lastChild);
  var textInsertPos = $head.pos;
  var childrenMInsertPos = $head.pos + 1;
  var childrenOInsertPos = afterListItemB - 2;
  var textContent = listItemK.firstChild.content;
  var childrenMContent = containsChildrenO ? listItemK.content.cut(listItemK.firstChild.nodeSize, listItemK.nodeSize - listItemK.lastChild.nodeSize - 2 //Get the position before
  ) : listItemK.content.cut(listItemK.firstChild.nodeSize);
  var childrenOContent = listItemK.lastChild.content;
  (0, _commands.insertContentDeleteRange)(tr, function (tr) {
    return tr.doc.resolve(textInsertPos);
  }, containsChildrenO ? [[textContent, textInsertPos], [childrenMContent, childrenMInsertPos], [childrenOContent, childrenOInsertPos]] : [[textContent, textInsertPos], [childrenMContent, childrenMInsertPos]], [[beforeListItemK, afterListItemK]]);
  return true;
};

exports.joinListItemWithParentNestedList = joinListItemWithParentNestedList;