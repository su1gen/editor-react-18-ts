"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedNodeOrNodeParentByNodeType = getSelectedNodeOrNodeParentByNodeType;
exports.toDOM = void 0;

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorModel = require("prosemirror-model");

function getSelectedNodeOrNodeParentByNodeType(_ref) {
  var nodeType = _ref.nodeType,
      selection = _ref.selection;
  var node = (0, _prosemirrorUtils.findSelectedNodeOfType)(nodeType)(selection);

  if (!node) {
    node = (0, _prosemirrorUtils.findParentNodeOfType)(nodeType)(selection);
  }

  return node;
}

var toDOM = function toDOM(node, schema) {
  return _prosemirrorModel.DOMSerializer.fromSchema(schema).serializeNode(node);
};

exports.toDOM = toDOM;