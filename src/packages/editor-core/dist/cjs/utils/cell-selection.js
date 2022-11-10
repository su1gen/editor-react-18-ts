"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cellSelectionNodesBetween = void 0;

var cellSelectionNodesBetween = function cellSelectionNodesBetween(selection, doc, f, startPos) {
  selection.forEachCell(function (cell, cellPos) {
    doc.nodesBetween(cellPos, cellPos + cell.nodeSize, f, startPos);
  });
};

exports.cellSelectionNodesBetween = cellSelectionNodesBetween;