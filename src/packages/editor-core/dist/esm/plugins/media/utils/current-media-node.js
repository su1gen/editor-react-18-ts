import { NodeSelection } from 'prosemirror-state';
export var currentMediaNode = function currentMediaNode(editorState) {
  var doc = editorState.doc,
      selection = editorState.selection,
      schema = editorState.schema;

  if (!doc || !selection || !(selection instanceof NodeSelection) || selection.node.type !== schema.nodes.mediaSingle) {
    return;
  }

  var node = doc.nodeAt(selection.$anchor.pos + 1);

  if (!node || node.type !== schema.nodes.media) {
    return;
  }

  return node;
};