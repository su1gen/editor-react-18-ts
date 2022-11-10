import { TextSelection } from 'prosemirror-state';
export var isSelectionAtPlaceholder = function isSelectionAtPlaceholder(selection) {
  if (!(selection instanceof TextSelection) || !selection.$cursor) {
    return false;
  }

  var node = selection.$cursor.doc.nodeAt(selection.$cursor.pos);
  return (node === null || node === void 0 ? void 0 : node.type.name) === 'placeholder';
};