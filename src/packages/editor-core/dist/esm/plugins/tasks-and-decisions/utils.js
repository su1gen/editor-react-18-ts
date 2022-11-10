import { Fragment, Slice } from 'prosemirror-model'; // If slice is decisionItem, wrap it inside a decisionList. This prevents an
// additional newline from being pasted along with the selected decision item.

export var transformSliceToDecisionList = function transformSliceToDecisionList(slice, schema) {
  var node = slice.content.firstChild;

  if (slice.content.childCount === 1 && node && node.type.name === 'decisionItem') {
    var decisionListWrapperNode = schema.nodes.decisionList.create({}, node);
    return new Slice(Fragment.from(decisionListWrapperNode), slice.openStart, slice.openEnd);
  }

  return slice;
};