import { findSelectedNodeOfType, findParentNodeOfType } from 'prosemirror-utils';
import { DOMSerializer } from 'prosemirror-model';
export function getSelectedNodeOrNodeParentByNodeType(_ref) {
  var nodeType = _ref.nodeType,
      selection = _ref.selection;
  var node = findSelectedNodeOfType(nodeType)(selection);

  if (!node) {
    node = findParentNodeOfType(nodeType)(selection);
  }

  return node;
}
export var toDOM = function toDOM(node, schema) {
  return DOMSerializer.fromSchema(schema).serializeNode(node);
};