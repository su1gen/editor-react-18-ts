import { TextSelection } from 'prosemirror-state';
export const isSelectionAtPlaceholder = selection => {
  if (!(selection instanceof TextSelection) || !selection.$cursor) {
    return false;
  }

  const node = selection.$cursor.doc.nodeAt(selection.$cursor.pos);
  return (node === null || node === void 0 ? void 0 : node.type.name) === 'placeholder';
};