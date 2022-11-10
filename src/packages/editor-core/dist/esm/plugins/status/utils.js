import { NodeSelection, Selection } from 'prosemirror-state';
export var mayGetStatusAtSelection = function mayGetStatusAtSelection(selection) {
  if (selection && selection instanceof NodeSelection) {
    var nodeSelection = selection;

    if (nodeSelection.node.type.name === 'status') {
      return selection.node.attrs || null;
    }
  }

  return null;
};
export var mayGetStatusAtPos = function mayGetStatusAtPos(pos, doc) {
  if (pos) {
    var node = doc.nodeAt(pos);

    if (node && node.type.name === 'status') {
      return node.attrs;
    }
  }

  return null;
};
export var isEmptyStatus = function isEmptyStatus(node) {
  return node && (node.text && node.text.trim().length === 0 || node.text === '');
};
export var setSelectionNearPos = function setSelectionNearPos(tr, pos) {
  return tr.setSelection(Selection.near(tr.doc.resolve(tr.mapping.map(pos))));
};
export var setNodeSelectionNearPos = function setNodeSelectionNearPos(tr, pos) {
  return tr.setSelection(NodeSelection.create(tr.doc, tr.mapping.map(pos)));
};