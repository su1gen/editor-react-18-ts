import { keymap } from 'prosemirror-keymap';
import * as keymaps from '../../../keymaps';
import { isEmptyNode, isSelectionInsideLastNodeInDocument } from '../../../utils';
import { safeInsert } from 'prosemirror-utils';
import { selectNodeBackward } from 'prosemirror-commands';
import { atTheEndOfDoc } from '../../../utils/prosemirror/position';
/**
 * Check if is an empty selection at the start of the node
 */

function isEmptySelectionAtStart(selection) {
  if (!selection.empty) {
    return false;
  }

  var $from = selection.$from;
  return $from.parentOffset <= 0;
}
/**
 * Check if the current selection is inside a node type
 */


function isSelectionInsideOf(selection, nodeType) {
  var $from = selection.$from;
  var parent = $from.parent;
  return parent.type === nodeType;
}
/**
 * Return the sibling of the current selection
 */


function getSibling(selection, sibling) {
  var $from = selection.$from;
  var index = $from.index($from.depth - 1);
  var grandParent = $from.node($from.depth - 1); // Get GrandParent

  return grandParent ? grandParent.maybeChild(index + sibling) : null;
}
/**
 * Check if respective sibling (negative number previous, positive number next)
 * is from the specified node
 */


function isSiblingOfType(selection, node, sibling) {
  var maybeSiblingNode = getSibling(selection, sibling);
  return !!maybeSiblingNode && maybeSiblingNode.type === node;
}
/**
 * When there's any empty block before another paragraph with wrap-right
 * mediaSingle. Pressing backspace at the start of the paragraph will select
 * the media but visually it makes more sense to remove the empty paragraph.
 *
 * Structure of the document: doc(block(), mediaSingle(media()), paragraph('{<>}hello!'))
 * But, visually it looks like the following:
 *
 *    [empty block] <- Remove this block
 * or [paragraph block] <- Move text inside this paragraph
 * or [any other block] <- Move paragraph node after this node
 * [Cursor] x x x x x x x x  +---------------+
 * x x x x x x x x x x       |  mediaSingle  |
 * x x x x x.                +---------------+
 */


function handleSelectionAfterWrapRight(isEmptyNode) {
  function isEmptyWithoutThrow(node) {
    var isEmpty = false;

    try {
      // We dont have isEmptyNode definition for table for example.
      // In this case it will throw we need to catch it
      isEmpty = isEmptyNode(node);
    } catch (e) {}

    return isEmpty;
  }

  return function (state, dispatch) {
    var $from = state.selection.$from;
    var paragraph = state.schema.nodes.paragraph;
    var previousMediaSingleSibling = -2;
    var maybeSibling = getSibling(state.selection, previousMediaSingleSibling);

    if (!maybeSibling) {
      // the last is the image so should let the default behaviour delete the image
      return false;
    }

    var mediaSingle = getSibling(state.selection, -1); // Sibling is a media single already checked in main code

    var mediaSinglePos = $from.pos - mediaSingle.nodeSize; // Should find the position
    // Should move the current paragraph to the last line

    var maybeAnyBlockPos = mediaSinglePos - maybeSibling.nodeSize;
    var tr = state.tr;

    if (isEmptyWithoutThrow(maybeSibling)) {
      // Should remove the empty sibling
      tr = tr.replace(maybeAnyBlockPos - 1, maybeAnyBlockPos + maybeSibling.nodeSize);
    } else {
      // We move the current node, to the new position
      // 1. Remove current node, only if I am not removing the last node.
      if (!isSelectionInsideLastNodeInDocument(state.selection)) {
        tr.replace($from.pos - 1, $from.pos + $from.parent.nodeSize - 1); // Remove node
      } else {
        // Remove node content, if is the last node, let a empty paragraph
        tr.replace($from.pos, $from.pos + $from.parent.nodeSize - 1);
      } // 2. Add it in the new position
      // If the sibling is a paragraph lets copy the text inside the paragraph
      // Like a normal backspace from paragraph to paragraph


      if (maybeSibling.type === paragraph) {
        var insideParagraphPos = maybeAnyBlockPos + maybeSibling.nodeSize - 2;
        safeInsert($from.parent.content, insideParagraphPos)(tr);
      } else {
        // If is any other kind of block just add the paragraph after it
        var endOfBlockPos = maybeAnyBlockPos + maybeSibling.nodeSize - 1;
        safeInsert($from.parent.copy($from.parent.content), endOfBlockPos)(tr);
      }
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

var maybeRemoveMediaSingleNode = function maybeRemoveMediaSingleNode(schema) {
  var isEmptyNodeInSchema = isEmptyNode(schema);
  return function (state, dispatch) {
    var selection = state.selection,
        schema = state.schema;
    var $from = selection.$from;

    if (!isEmptySelectionAtStart(state.selection)) {
      return false;
    }

    if (!isSelectionInsideOf(state.selection, schema.nodes.paragraph)) {
      return false;
    }

    var previousSibling = -1;

    if (!isSiblingOfType(state.selection, schema.nodes.mediaSingle, previousSibling)) {
      // no media single
      return false;
    }

    var mediaSingle = getSibling(state.selection, previousSibling);

    if (mediaSingle.attrs.layout === 'wrap-right') {
      return handleSelectionAfterWrapRight(isEmptyNodeInSchema)(state, dispatch);
    }

    if (dispatch) {
      // Select media single, and remove paragraph if it's empty.
      selectNodeBackward(state, function (tr) {
        if (isEmptyNodeInSchema($from.parent) && !atTheEndOfDoc(state)) {
          tr.replace($from.pos - 1, $from.pos + $from.parent.nodeSize - 1); // Remove node
        }

        dispatch(tr);
      });
    }

    return true;
  };
};

export default function keymapPlugin(schema) {
  var list = {};
  var removeMediaSingleCommand = maybeRemoveMediaSingleNode(schema);
  keymaps.bindKeymapWithCommand(keymaps.backspace.common, removeMediaSingleCommand, list);
  return keymap(list);
}