"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinSiblingListItems = void 0;

var _commands = require("../../../../utils/commands");

//Case for two adjacent list items of the same indentation
var joinSiblingListItems = function joinSiblingListItems(_ref) {
  var tr = _ref.tr,
      $next = _ref.$next,
      $head = _ref.$head;

  /* CASE 2
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |$head||textInsertPos| }       //Cant have children since that would be Case 4
   *   |childrenGInsertPos| }
   *   ListItem E { |$next|
   *     Paragraph F { text2 }
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
  var listItemE = $next.parent;
  var paragraphF = $next.nodeAfter; //ListItem must have at least one child

  if (!paragraphF) {
    return false;
  }

  var beforeListItemE = $next.before();
  var afterListItemE = $next.after();
  var endListItemB = $head.end(-1);
  var textInsertPos = $head.pos;
  var childrenGInsertPos = endListItemB;
  var textContent = paragraphF.content;
  var childrenGContent = listItemE.content.cut(paragraphF.nodeSize);
  (0, _commands.insertContentDeleteRange)(tr, function (tr) {
    return tr.doc.resolve(textInsertPos);
  }, [[textContent, textInsertPos], [childrenGContent, childrenGInsertPos]], [[beforeListItemE, afterListItemE]]);
  return true;
};

exports.joinSiblingListItems = joinSiblingListItems;