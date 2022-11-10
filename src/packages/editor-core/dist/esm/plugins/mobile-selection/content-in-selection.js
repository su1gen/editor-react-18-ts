// Gets a plain text representation of the nodes in the current selection
export var contentInSelection = function contentInSelection(_ref) {
  var selection = _ref.selection,
      doc = _ref.doc;
  var nodes = new Array();
  var marks = new Array();
  doc.nodesBetween(selection.from, selection.to, function (node) {
    nodes.push(node.type.name);
    node.marks.forEach(function (mark) {
      return marks.push(mark.type.name);
    });
    return true;
  });
  return {
    nodeTypes: Array.from(nodes),
    markTypes: Array.from(marks)
  };
};