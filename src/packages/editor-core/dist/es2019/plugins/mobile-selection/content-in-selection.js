// Gets a plain text representation of the nodes in the current selection
export const contentInSelection = ({
  selection,
  doc
}) => {
  const nodes = new Array();
  const marks = new Array();
  doc.nodesBetween(selection.from, selection.to, node => {
    nodes.push(node.type.name);
    node.marks.forEach(mark => marks.push(mark.type.name));
    return true;
  });
  return {
    nodeTypes: Array.from(nodes),
    markTypes: Array.from(marks)
  };
};