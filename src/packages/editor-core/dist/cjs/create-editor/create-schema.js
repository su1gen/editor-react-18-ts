"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSchema = createSchema;

var _sortByOrder = require("./sort-by-order");

var _prosemirrorModel = require("prosemirror-model");

var _adfSchema = require("@atlaskit/adf-schema");

var _createEditor = require("./create-editor");

function createSchema(editorConfig) {
  var marks = (0, _createEditor.fixExcludes)(editorConfig.marks.sort((0, _sortByOrder.sortByOrder)('marks')).reduce(function (acc, mark) {
    acc[mark.name] = mark.mark;
    return acc;
  }, {}));
  var nodes = (0, _adfSchema.sanitizeNodes)(editorConfig.nodes.sort((0, _sortByOrder.sortByOrder)('nodes')).reduce(function (acc, node) {
    acc[node.name] = node.node;
    return acc;
  }, {}), marks);
  return new _prosemirrorModel.Schema({
    nodes: nodes,
    marks: marks
  });
}