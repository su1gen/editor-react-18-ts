"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinListItemWithParagraph = void 0;

var _commands = require("../../../../utils/commands");

var _prosemirrorModel = require("prosemirror-model");

var _node = require("../../utils/node");

// Case for when a users selection is at the end of a paragraph, the paragraph
// is followed by a list, and they delete forward
var joinListItemWithParagraph = function joinListItemWithParagraph(_ref) {
  var tr = _ref.tr,
      $next = _ref.$next,
      $head = _ref.$head;

  // For empty paragraphs before a list
  if ($head.parent.content.size < 1) {
    (0, _commands.insertContentDeleteRange)(tr, function (tr) {
      return tr.doc.resolve($head.pos);
    }, [], [[$head.pos - 1, $head.pos]]);
    return true;
  }

  var paragraphPosition = $head.pos;
  var list = tr.doc.nodeAt($next.pos - 1);
  var firstListItem = tr.doc.nodeAt($next.pos);

  if (!list || !firstListItem) {
    return false;
  }

  var firstChildNodeOfFirstListItem = firstListItem.firstChild;

  if (!firstChildNodeOfFirstListItem) {
    return false;
  }

  var lastChildOfFirstListItem = firstListItem.lastChild;
  var firstGrandchildOfFirstListItem = firstChildNodeOfFirstListItem.firstChild;
  var firstListItemHasOneChildWithNoNestedLists = hasSingleChild(firstListItem) && firstChildNodeOfFirstListItem.childCount < 2 && $next.nodeAfter;
  var firstListItemContainsParagraphAndNestedList = !hasSingleChild(firstListItem) && lastChildOfFirstListItem && (0, _node.isListNode)(lastChildOfFirstListItem);
  var insertions = [];
  var deletions = []; // For lists that only have one list item with no children - need to remove remaining list

  if (hasSingleChild(list) && hasSingleChild(firstListItem) && $next.nodeAfter) {
    deletions.push([tr.mapping.map($next.pos - 1), tr.mapping.map($next.pos + $next.nodeAfter.nodeSize + 1)]);
  } // For first list items that have a paragraph and a list


  if (firstListItemContainsParagraphAndNestedList) {
    var firstListItemNestedList = _prosemirrorModel.Fragment.from(lastChildOfFirstListItem.content);

    insertions.push([firstListItemNestedList, tr.mapping.map($next.pos)]);
  } // For first list item has one child & no nested lists OR first list items that have a paragraph and a list


  if (firstListItemHasOneChildWithNoNestedLists || firstListItemContainsParagraphAndNestedList) {
    deletions.push([tr.mapping.map($next.pos), tr.mapping.map($next.pos + firstListItem.nodeSize - 1)]);

    var firstListItemText = _prosemirrorModel.Fragment.from(firstChildNodeOfFirstListItem.content);

    insertions.push([firstListItemText, paragraphPosition]);
    (0, _commands.insertContentDeleteRange)(tr, function (tr) {
      return tr.doc.resolve($head.pos);
    }, insertions, deletions);
    return true;
  } // For any first list items that have multiple children (eg. multiple paragraphs)


  if (firstListItem.childCount > 1) {
    insertions.push([_prosemirrorModel.Fragment.from(firstChildNodeOfFirstListItem.content), paragraphPosition]);
    deletions.push([tr.mapping.map($next.pos + 1), tr.mapping.map($next.pos + firstChildNodeOfFirstListItem.nodeSize + 1)]);
    (0, _commands.insertContentDeleteRange)(tr, function (tr) {
      return tr.doc.resolve($head.pos);
    }, insertions, deletions);
    return true;
  } // For any remaining first list items that have a single child (eg. single paragraph, multiple lines of text)


  if (firstGrandchildOfFirstListItem && firstGrandchildOfFirstListItem.type.name === 'hardBreak') {
    var nodeSizeOfGrandchild = firstGrandchildOfFirstListItem ? firstGrandchildOfFirstListItem.nodeSize : 0;
    deletions.push([tr.mapping.map($next.pos + 2), tr.mapping.map($next.pos + 2 + nodeSizeOfGrandchild)]);
  } else {
    insertions.push([_prosemirrorModel.Fragment.from(firstChildNodeOfFirstListItem.content), paragraphPosition]);
    var nodeSizeOfFirstChild = firstChildNodeOfFirstListItem.nodeSize;
    deletions.push([tr.mapping.map($next.pos), tr.mapping.map($next.pos + 2 + nodeSizeOfFirstChild)]);
  }

  (0, _commands.insertContentDeleteRange)(tr, function (tr) {
    return tr.doc.resolve($head.pos);
  }, insertions, deletions);
  return true;
};

exports.joinListItemWithParagraph = joinListItemWithParagraph;

var hasSingleChild = function hasSingleChild(node) {
  return node.childCount === 1;
};