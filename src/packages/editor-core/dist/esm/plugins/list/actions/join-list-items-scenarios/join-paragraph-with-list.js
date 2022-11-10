import { insertContentDeleteRange } from '../../../../utils/commands';
//Case for two adjacent nodes with the first being a list item and the last being a paragraph
export var joinParagrapWithList = function joinParagrapWithList(_ref) {
  var tr = _ref.tr,
      $next = _ref.$next,
      $head = _ref.$head;

  /* CASE 1
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |$head||textInsertPos| }
   *   }
   * }
   * Paragraph E { |$next| text 2 }
   *
   * Converts to:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1text2 }
   *   }
   * }
   *
   */
  var paragraphE = $next.parent;
  var beforeParagraphE = $next.before();
  var afterParagraphE = $next.after();
  var textInsertPos = $head.pos;
  var textContent = paragraphE.content;
  insertContentDeleteRange(tr, function (tr) {
    return tr.doc.resolve(textInsertPos);
  }, [[textContent, textInsertPos]], [[beforeParagraphE, afterParagraphE]]);
  return true;
};