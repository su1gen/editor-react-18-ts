"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countNodes = countNodes;

function countNodes(state) {
  var _nodeTypes$extension, _nodeTypes$inlineExte, _nodeTypes$bodiedExte;

  var nodeCount = {};
  var extensionNodeCount = {};
  var nodeTypes = state.schema.nodes;
  var extensionNodeTypes = [(_nodeTypes$extension = nodeTypes.extension) === null || _nodeTypes$extension === void 0 ? void 0 : _nodeTypes$extension.name, (_nodeTypes$inlineExte = nodeTypes.inlineExtension) === null || _nodeTypes$inlineExte === void 0 ? void 0 : _nodeTypes$inlineExte.name, (_nodeTypes$bodiedExte = nodeTypes.bodiedExtension) === null || _nodeTypes$bodiedExte === void 0 ? void 0 : _nodeTypes$bodiedExte.name];
  state.doc.descendants(function (node) {
    var _node$attrs;

    var nodeName = node.type.name;

    if (nodeName in nodeCount) {
      nodeCount[nodeName]++;
    } else {
      nodeCount[nodeName] = 1;
    }

    var extensionNodeName = nodeName;

    if (extensionNodeTypes.includes(extensionNodeName) && (_node$attrs = node.attrs) !== null && _node$attrs !== void 0 && _node$attrs.extensionType) {
      var _node$attrs2;

      extensionNodeName = "".concat(node.attrs.extensionType, " - ").concat((_node$attrs2 = node.attrs) === null || _node$attrs2 === void 0 ? void 0 : _node$attrs2.extensionKey);

      if (extensionNodeName in extensionNodeCount) {
        extensionNodeCount[extensionNodeName]++;
      } else {
        extensionNodeCount[extensionNodeName] = 1;
      }
    }

    return true;
  });
  return {
    nodeCount: nodeCount,
    extensionNodeCount: extensionNodeCount
  };
}