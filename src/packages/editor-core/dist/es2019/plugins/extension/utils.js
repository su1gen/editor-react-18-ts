import { findParentNodeOfType, findSelectedNodeOfType, findDomRefAtPos } from 'prosemirror-utils';
import { closestElement } from '../../utils/dom';
import { findNodePosByLocalIds } from '../../utils/nodes-by-localIds';
export const getSelectedExtension = (state, searchParent = false) => {
  const {
    inlineExtension,
    extension,
    bodiedExtension
  } = state.schema.nodes;
  const nodeTypes = [extension, bodiedExtension, inlineExtension];
  return findSelectedNodeOfType(nodeTypes)(state.selection) || searchParent && findParentNodeOfType(nodeTypes)(state.selection) || undefined;
};
export const findExtensionWithLocalId = (state, localId) => {
  const selectedExtension = getSelectedExtension(state, true);

  if (!localId) {
    return selectedExtension;
  }

  if (selectedExtension && selectedExtension.node.attrs.localId === localId) {
    return selectedExtension;
  }

  const {
    inlineExtension,
    extension,
    bodiedExtension
  } = state.schema.nodes;
  const nodeTypes = [extension, bodiedExtension, inlineExtension];
  let matched;
  state.doc.descendants((node, pos) => {
    if (nodeTypes.includes(node.type) && node.attrs.localId === localId) {
      matched = {
        node,
        pos
      };
    }
  });
  return matched;
};
export const getSelectedDomElement = (schema, domAtPos, selectedExtensionNode) => {
  const selectedExtensionDomNode = findDomRefAtPos(selectedExtensionNode.pos, domAtPos);
  const isContentExtension = selectedExtensionNode.node.type !== schema.nodes.bodiedExtension;
  return (// Content extension can be nested in bodied-extension, the following check is necessary for that case
    (isContentExtension ? // Search down
    selectedExtensionDomNode.querySelector('.extension-container') : // Try searching up and then down
    closestElement(selectedExtensionDomNode, '.extension-container') || selectedExtensionDomNode.querySelector('.extension-container')) || selectedExtensionDomNode
  );
};
export const getDataConsumerMark = newNode => {
  var _newNode$marks;

  return (_newNode$marks = newNode.marks) === null || _newNode$marks === void 0 ? void 0 : _newNode$marks.find(mark => mark.type.name === 'dataConsumer');
};
export const getNodeTypesReferenced = (ids, state) => {
  return findNodePosByLocalIds(state, ids, {
    includeDocNode: true
  }).map(({
    node
  }) => node.type.name);
};
export const findNodePosWithLocalId = (state, localId) => {
  const nodes = findNodePosByLocalIds(state, [localId]);
  return nodes.length >= 1 ? nodes[0] : undefined;
};