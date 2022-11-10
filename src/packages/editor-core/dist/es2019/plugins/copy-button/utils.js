import { findSelectedNodeOfType, findParentNodeOfType } from 'prosemirror-utils';
import { DOMSerializer } from 'prosemirror-model';
export function getSelectedNodeOrNodeParentByNodeType({
  nodeType,
  selection
}) {
  let node = findSelectedNodeOfType(nodeType)(selection);

  if (!node) {
    node = findParentNodeOfType(nodeType)(selection);
  }

  return node;
}
export const toDOM = (node, schema) => {
  return DOMSerializer.fromSchema(schema).serializeNode(node);
};