"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertBlock = void 0;

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorState = require("prosemirror-state");

var insertBlock = function insertBlock(state, nodeType, nodeName, start, end, attrs) {
  // To ensure that match is done after HardBreak.
  var _state$schema$nodes = state.schema.nodes,
      hardBreak = _state$schema$nodes.hardBreak,
      codeBlock = _state$schema$nodes.codeBlock,
      listItem = _state$schema$nodes.listItem;
  var $pos = state.doc.resolve(start);

  if ($pos.nodeAfter.type !== hardBreak) {
    return null;
  } // To ensure no nesting is done. (unless we're inserting a codeBlock inside lists)


  if ($pos.depth > 1 && !(nodeType === codeBlock && (0, _prosemirrorUtils.hasParentNodeOfType)(listItem)(state.selection))) {
    return null;
  } // Split at the start of autoformatting and delete formatting characters.


  var tr = state.tr.delete(start, end).split(start);
  var currentNode = tr.doc.nodeAt(start + 1); // If node has more content split at the end of autoformatting.

  var nodeHasMoreContent = false;
  tr.doc.nodesBetween(start, start + currentNode.nodeSize, function (node, pos) {
    if (!nodeHasMoreContent && node.type === hardBreak) {
      nodeHasMoreContent = true;
      tr = tr.split(pos + 1).delete(pos, pos + 1);
    }
  });

  if (nodeHasMoreContent) {
    currentNode = tr.doc.nodeAt(start + 1);
  } // Create new node and fill with content of current node.


  var _state$schema$nodes2 = state.schema.nodes,
      blockquote = _state$schema$nodes2.blockquote,
      paragraph = _state$schema$nodes2.paragraph;
  var content;
  var depth;

  if (nodeType === blockquote) {
    depth = 3;
    content = [paragraph.create({}, currentNode.content)];
  } else {
    depth = 2;
    content = currentNode.content;
  }

  var newNode = nodeType.create(attrs, content); // Add new node.

  tr = tr.setSelection(new _prosemirrorState.NodeSelection(tr.doc.resolve(start + 1))).replaceSelectionWith(newNode).setSelection(new _prosemirrorState.TextSelection(tr.doc.resolve(start + depth)));
  return tr;
};

exports.insertBlock = insertBlock;