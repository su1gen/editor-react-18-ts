"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currentMediaNode = void 0;

var _prosemirrorState = require("prosemirror-state");

var currentMediaNode = function currentMediaNode(editorState) {
  var doc = editorState.doc,
      selection = editorState.selection,
      schema = editorState.schema;

  if (!doc || !selection || !(selection instanceof _prosemirrorState.NodeSelection) || selection.node.type !== schema.nodes.mediaSingle) {
    return;
  }

  var node = doc.nodeAt(selection.$anchor.pos + 1);

  if (!node || node.type !== schema.nodes.media) {
    return;
  }

  return node;
};

exports.currentMediaNode = currentMediaNode;