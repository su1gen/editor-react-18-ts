import { insertContentDeleteRange } from '../../../../utils/commands';
import { isListNode } from '../../utils/node';
//Case for two adjacent list items with the first being of lower indentation
export var joinNestedListWithParentListItem = function joinNestedListWithParentListItem(_ref) {
  var tr = _ref.tr,
      $next = _ref.$next,
      $head = _ref.$head;

  /* CASE 3
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |$head||textInsertPos| } |childrenHInsertPos|
   *     List E { |$next||childrenJInsertPos|
   *       ListItem F {
   *         Paragraph G { text2 }
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
  var listE = $next.parent;
  var listItemF = $next.nodeAfter; //We know next is before a ListItem. ListItem must have at least one child

  if (!listItemF || !listItemF.lastChild) {
    return false;
  }

  var paragraphG = listItemF.firstChild; //ListItem must have at least one child

  if (!paragraphG) {
    return false;
  }

  var beforeListE = $next.before();
  var beforeListItemF = $next.pos;
  var afterParagraphD = $head.after();
  var afterListE = $next.after();
  var afterListItemF = tr.doc.resolve($next.pos + 1).after(); //List must always have at least one listItem

  var containsChildrenJ = isListNode(listItemF.lastChild);
  var shouldRemoveListE = listE.childCount === 1 && !containsChildrenJ; //Assures no Children J and K

  var textInsertPos = $head.pos;
  var childrenHInsertPos = afterParagraphD;
  var childrenJInsertPos = $next.pos;
  var textContent = paragraphG.content;
  var childrenHContent = containsChildrenJ ? listItemF.content.cut(paragraphG.nodeSize, listItemF.nodeSize - listItemF.lastChild.nodeSize - 2) : listItemF.content.cut(paragraphG.nodeSize); //If Children J doesn't exist then Children H will include the last node

  var childrenJContent = listItemF.lastChild.content; //Will be invalid if there are no Children J but it will be unused

  insertContentDeleteRange(tr, function (tr) {
    return tr.doc.resolve(textInsertPos);
  }, containsChildrenJ ? [[textContent, textInsertPos], [childrenHContent, childrenHInsertPos], [childrenJContent, childrenJInsertPos]] : [[textContent, textInsertPos], [childrenHContent, childrenHInsertPos]], [shouldRemoveListE ? [beforeListE, afterListE] : [beforeListItemF, afterListItemF]]);
  return true;
};