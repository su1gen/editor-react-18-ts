import { TextSelection } from 'prosemirror-state';
export const setSelectionBeforeQuery = rawText => tr => {
  const currentPosition = tr.selection.$from.pos;
  const positionBeforeRawText = Math.max(currentPosition - rawText.length, 0);
  const resolvedPositionBeforeText = tr.doc.resolve(positionBeforeRawText);
  const nextSelection = TextSelection.findFrom(resolvedPositionBeforeText, -1, true);

  if (nextSelection) {
    tr.setSelection(nextSelection);
  }
};