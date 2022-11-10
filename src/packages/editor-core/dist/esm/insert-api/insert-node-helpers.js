/* Copied from type-ahead */
import { TextSelection, NodeSelection } from 'prosemirror-state';
import { Node as PMNode, Slice, Fragment } from 'prosemirror-model';
import { normaliseNestedLayout } from '../utils/selection';
import { safeInsert } from '../utils/insert';

function findInsertPoint(doc, pos, nodeToInsert) {
  var $pos = doc.resolve(pos);

  var createInsertPosition = function createInsertPosition(from, to) {
    return {
      from: from,
      to: to || from
    };
  }; // Search for a valid position for nodeToInsert in progressively higher levels


  for (var level = $pos.depth; level >= 0; level--) {
    var nodeAtLevel = $pos.node(level); // Try to replace the empty paragraph in the level above
    // Scenario:
    //   doc(
    //     table(
    //       row(
    //         cell(
    //           p('{<>}'),
    //         ),
    //       )
    //     )
    //   )

    var levelAbove = Math.max(level - 1, 0);
    var parentNode = $pos.node(levelAbove); // Special case: when this is true, the 'to' position should be the end
    // of the empty paragraph

    var isNodeAtLevelEmptyParagraph = nodeAtLevel.type.name === 'paragraph' && nodeAtLevel.content.size === 0;
    var indexAtLevelAbove = $pos.index(levelAbove);
    var canReplaceNodeAtLevelAbove = parentNode.canReplaceWith(indexAtLevelAbove, indexAtLevelAbove, nodeToInsert.type);

    if (isNodeAtLevelEmptyParagraph && canReplaceNodeAtLevelAbove) {
      var from = $pos.posAtIndex(indexAtLevelAbove, levelAbove);
      return createInsertPosition(from, from + nodeAtLevel.nodeSize);
    } // Try to insert this node right after the node in the level above
    // Scenario:
    //   doc(
    //     panel(
    //       p('{<>}'),
    //     )
    //   )


    var indexAfterAtLevelAbove = $pos.indexAfter(levelAbove);
    var canInsertNodeAtLevelAbove = parentNode.canReplaceWith(indexAfterAtLevelAbove, indexAfterAtLevelAbove, nodeToInsert.type);

    if (canInsertNodeAtLevelAbove) {
      return createInsertPosition($pos.posAtIndex(indexAfterAtLevelAbove, levelAbove));
    }
  }

  return createInsertPosition(0);
}

export var insertBlockNode = function insertBlockNode(_ref) {
  var node = _ref.node,
      tr = _ref.tr,
      position = _ref.position;
  var start = position.$from.pos,
      end = position.$to.pos;

  if (node.isText) {
    return tr.replaceWith(start, end, node);
  }

  if (node.isBlock) {
    tr.delete(start, end);
    var mappedStart = tr.mapping.map(start);
    var nodeNormalized = normaliseNestedLayout(tr, node); // Handle edge cases for hr and mediaSingle

    var inserted = safeInsert(nodeNormalized, mappedStart)(tr);

    if (inserted) {
      return tr;
    }

    var sliceInserted = Slice.maxOpen(Fragment.from(nodeNormalized));

    var _findInsertPoint = findInsertPoint(tr.doc, mappedStart, nodeNormalized),
        from = _findInsertPoint.from,
        to = _findInsertPoint.to;

    tr.replaceWith(from, to, node);
    var openPosition = Math.min(from + (node.isAtom ? node.nodeSize : sliceInserted.openStart), tr.doc.content.size);
    var FORWARD_DIRECTION = 1;
    var nextSelection = TextSelection.findFrom(tr.doc.resolve(openPosition), FORWARD_DIRECTION, true);

    if (nextSelection) {
      return tr.setSelection(nextSelection);
    }
  }

  return tr;
};
export var insertInlineNodeOrFragment = function insertInlineNodeOrFragment(_ref2) {
  var maybeFragment = _ref2.maybeFragment,
      tr = _ref2.tr,
      position = _ref2.position,
      selectInlineNode = _ref2.selectInlineNode;
  var start = position.$from.pos,
      end = position.$to.pos;
  var fragment = maybeFragment instanceof PMNode ? Fragment.from(maybeFragment) : maybeFragment;
  tr.replaceWith(start, end, fragment);

  if (selectInlineNode) {
    return tr.setSelection(NodeSelection.create(tr.doc, start));
  }

  return tr.setSelection(TextSelection.near(tr.doc.resolve(start + fragment.size)));
};
export var insertProseMirrorContent = function insertProseMirrorContent(_ref3) {
  var tr = _ref3.tr,
      node = _ref3.node,
      position = _ref3.position,
      selectNodeInserted = _ref3.selectNodeInserted;

  if (node instanceof PMNode && node.isBlock) {
    insertBlockNode({
      node: node,
      tr: tr,
      position: position
    });
  } else {
    insertInlineNodeOrFragment({
      maybeFragment: node,
      tr: tr,
      position: position,
      selectInlineNode: selectNodeInserted
    });
  }
};