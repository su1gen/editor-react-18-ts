import { Slice, Fragment } from 'prosemirror-model';
import { mapSlice } from '../../utils/slice';
import { findSelectedNodeOfType, findParentNodeOfType } from 'prosemirror-utils';

function joinCodeBlocks(left, right) {
  var textContext = "".concat(left.textContent, "\n").concat(right.textContent);
  return left.type.create(left.attrs, left.type.schema.text(textContext));
}

function mergeAdjacentCodeBlocks(fragment) {
  var children = [];
  fragment.forEach(function (maybeCodeBlock) {
    if (maybeCodeBlock.type === maybeCodeBlock.type.schema.nodes.codeBlock) {
      var peekAtPrevious = children[children.length - 1];

      if (peekAtPrevious && peekAtPrevious.type === maybeCodeBlock.type) {
        return children.push(joinCodeBlocks(children.pop(), maybeCodeBlock));
      }
    }

    return children.push(maybeCodeBlock);
  });
  return Fragment.from(children);
}

export function transformSliceToJoinAdjacentCodeBlocks(slice) {
  slice = mapSlice(slice, function (node) {
    return node.isBlock && !node.isTextblock ? node.copy(mergeAdjacentCodeBlocks(node.content)) : node;
  }); // mapSlice won't be able to merge adjacent top-level code-blocks

  return new Slice(mergeAdjacentCodeBlocks(slice.content), slice.openStart, slice.openEnd);
}
export var transformSingleLineCodeBlockToCodeMark = function transformSingleLineCodeBlockToCodeMark(slice, schema) {
  if (slice.content.childCount === 1 && (slice.openStart || slice.openEnd)) {
    var maybeCodeBlock = slice.content.firstChild;

    if (maybeCodeBlock && maybeCodeBlock.type === schema.nodes.codeBlock) {
      if (maybeCodeBlock.textContent && maybeCodeBlock.textContent.indexOf('\n') === -1) {
        return new Slice(Fragment.from(schema.text(maybeCodeBlock.textContent, [schema.marks.code.create()])), 0, 0);
      }
    }
  }

  return slice;
};
export var findCodeBlock = function findCodeBlock(state, selection) {
  var codeBlock = state.schema.nodes.codeBlock;
  return findSelectedNodeOfType(codeBlock)(selection || state.selection) || findParentNodeOfType(codeBlock)(selection || state.selection);
};