export var cellSelectionNodesBetween = function cellSelectionNodesBetween(selection, doc, f, startPos) {
  selection.forEachCell(function (cell, cellPos) {
    doc.nodesBetween(cellPos, cellPos + cell.nodeSize, f, startPos);
  });
};