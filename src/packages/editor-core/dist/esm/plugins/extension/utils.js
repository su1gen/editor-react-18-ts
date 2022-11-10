import { findParentNodeOfType, findSelectedNodeOfType, findDomRefAtPos } from 'prosemirror-utils';
import { closestElement } from '../../utils/dom';
import { findNodePosByLocalIds } from '../../utils/nodes-by-localIds';
export var getSelectedExtension = function getSelectedExtension(state) {
  var searchParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var _state$schema$nodes = state.schema.nodes,
      inlineExtension = _state$schema$nodes.inlineExtension,
      extension = _state$schema$nodes.extension,
      bodiedExtension = _state$schema$nodes.bodiedExtension;
  var nodeTypes = [extension, bodiedExtension, inlineExtension];
  return findSelectedNodeOfType(nodeTypes)(state.selection) || searchParent && findParentNodeOfType(nodeTypes)(state.selection) || undefined;
};
export var findExtensionWithLocalId = function findExtensionWithLocalId(state, localId) {
  var selectedExtension = getSelectedExtension(state, true);

  if (!localId) {
    return selectedExtension;
  }

  if (selectedExtension && selectedExtension.node.attrs.localId === localId) {
    return selectedExtension;
  }

  var _state$schema$nodes2 = state.schema.nodes,
      inlineExtension = _state$schema$nodes2.inlineExtension,
      extension = _state$schema$nodes2.extension,
      bodiedExtension = _state$schema$nodes2.bodiedExtension;
  var nodeTypes = [extension, bodiedExtension, inlineExtension];
  var matched;
  state.doc.descendants(function (node, pos) {
    if (nodeTypes.includes(node.type) && node.attrs.localId === localId) {
      matched = {
        node: node,
        pos: pos
      };
    }
  });
  return matched;
};
export var getSelectedDomElement = function getSelectedDomElement(schema, domAtPos, selectedExtensionNode) {
  var selectedExtensionDomNode = findDomRefAtPos(selectedExtensionNode.pos, domAtPos);
  var isContentExtension = selectedExtensionNode.node.type !== schema.nodes.bodiedExtension;
  return (// Content extension can be nested in bodied-extension, the following check is necessary for that case
    (isContentExtension ? // Search down
    selectedExtensionDomNode.querySelector('.extension-container') : // Try searching up and then down
    closestElement(selectedExtensionDomNode, '.extension-container') || selectedExtensionDomNode.querySelector('.extension-container')) || selectedExtensionDomNode
  );
};
export var getDataConsumerMark = function getDataConsumerMark(newNode) {
  var _newNode$marks;

  return (_newNode$marks = newNode.marks) === null || _newNode$marks === void 0 ? void 0 : _newNode$marks.find(function (mark) {
    return mark.type.name === 'dataConsumer';
  });
};
export var getNodeTypesReferenced = function getNodeTypesReferenced(ids, state) {
  return findNodePosByLocalIds(state, ids, {
    includeDocNode: true
  }).map(function (_ref) {
    var node = _ref.node;
    return node.type.name;
  });
};
export var findNodePosWithLocalId = function findNodePosWithLocalId(state, localId) {
  var nodes = findNodePosByLocalIds(state, [localId]);
  return nodes.length >= 1 ? nodes[0] : undefined;
};