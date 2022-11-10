"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isConvertableToCodeBlock = isConvertableToCodeBlock;
exports.transformToCodeBlockAction = transformToCodeBlockAction;

var _prosemirrorState = require("prosemirror-state");

var _slice = require("../../../utils/slice");

var _prosemirrorModel = require("prosemirror-model");

var _utils = require("@atlaskit/editor-common/utils");

function transformToCodeBlockAction(state, start, attrs) {
  var startOfCodeBlockText = state.selection.$from;
  var endPosition = state.selection.empty ? startOfCodeBlockText.end() : state.selection.$to.pos;
  var startLinePosition = startOfCodeBlockText.start(); //when cmd+A is used to select the content. start position should be 0.

  var parentStartPosition = startOfCodeBlockText.depth === 0 ? 0 : startOfCodeBlockText.before();
  var contentSlice = state.doc.slice(startOfCodeBlockText.pos, endPosition);
  var codeBlockSlice = (0, _slice.mapSlice)(contentSlice, function (node, parent, index) {
    if (node.type === state.schema.nodes.hardBreak) {
      return state.schema.text('\n');
    }

    if (node.isText) {
      return node.mark([]);
    }

    if (node.isInline) {
      // Convert dates
      if (node.attrs.timestamp) {
        return state.schema.text((0, _utils.timestampToString)(node.attrs.timestamp, null));
      } // Convert links


      if (node.attrs.url) {
        return state.schema.text(node.attrs.url);
      }

      return node.attrs.text ? state.schema.text(node.attrs.text) : null;
    } // if the current node is the last child of the Slice exit early to prevent
    // adding additional line breaks


    if (contentSlice.content.childCount - 1 === index) {
      return node.content;
    } //useful to decide whether to append line breaks when the content has list items.


    var isParentLastChild = parent && contentSlice.content.childCount - 1 === index; // add line breaks at the end of each paragraph to mimic layout of selected content
    // do not add line breaks when the 'paragraph' parent is last child.

    if (node.content.childCount && node.type === state.schema.nodes.paragraph && !isParentLastChild) {
      return node.content.append(_prosemirrorModel.Fragment.from(state.schema.text('\n\n')));
    }

    return node.content.childCount ? node.content : null;
  });
  var tr = state.tr; // Replace current block node

  var startMapped = startLinePosition === start ? parentStartPosition : start;
  var codeBlock = state.schema.nodes.codeBlock;
  var codeBlockNode = codeBlock.createChecked(attrs, codeBlockSlice.content);
  tr.replaceWith(startMapped, Math.min(endPosition, tr.doc.content.size), codeBlockNode); // Reposition cursor when inserting into layouts or table headers

  var mapped = tr.doc.resolve(tr.mapping.map(startMapped) + 1);

  var selection = _prosemirrorState.TextSelection.findFrom(mapped, 1, true);

  if (selection) {
    return tr.setSelection(selection);
  }

  return tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, Math.min(start + startOfCodeBlockText.node().nodeSize - 1, tr.doc.content.size)));
}

function isConvertableToCodeBlock(state) {
  // Before a document is loaded, there is no selection.
  if (!state.selection) {
    return false;
  }

  var $from = state.selection.$from;
  var node = $from.parent;

  if (!node.isTextblock || node.type === state.schema.nodes.codeBlock) {
    return false;
  }

  var parentDepth = $from.depth - 1;
  var parentNode = $from.node(parentDepth);
  var index = $from.index(parentDepth);
  return parentNode.canReplaceWith(index, index + 1, state.schema.nodes.codeBlock);
}