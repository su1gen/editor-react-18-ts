import { TextSelection } from 'prosemirror-state';
export var setSelectionBeforeQuery = function setSelectionBeforeQuery(rawText) {
  return function (tr) {
    var currentPosition = tr.selection.$from.pos;
    var positionBeforeRawText = Math.max(currentPosition - rawText.length, 0);
    var resolvedPositionBeforeText = tr.doc.resolve(positionBeforeRawText);
    var nextSelection = TextSelection.findFrom(resolvedPositionBeforeText, -1, true);

    if (nextSelection) {
      tr.setSelection(nextSelection);
    }
  };
};