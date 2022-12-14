import { TextSelection } from 'prosemirror-state';
import { NodeRange } from 'prosemirror-model';
import { findWrapping } from 'prosemirror-transform';
import { findParentNodeClosestToPos } from 'prosemirror-utils';
import { isListNode, joinSiblingLists } from '../utils/node';
import { isEmptyParagraph } from '../../../utils';
import { findFirstParentListNode } from '../utils/find';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';
export function convertListType(_ref) {
  var tr = _ref.tr,
      nextListNodeType = _ref.nextListNodeType;
  var doc = tr.doc,
      _tr$selection = tr.selection,
      $from = _tr$selection.$from,
      $to = _tr$selection.$to;
  var listRange;

  if (tr.selection instanceof GapCursorSelection) {
    var _$from$nodeAfter;

    var nodeSize = ((_$from$nodeAfter = $from.nodeAfter) === null || _$from$nodeAfter === void 0 ? void 0 : _$from$nodeAfter.nodeSize) || 1;
    listRange = $from.blockRange($from.doc.resolve($from.pos + nodeSize));
  } else {
    listRange = $from.blockRange($to, isListNode);
  }

  if (listRange) {
    return convertSelectedList({
      tr: tr,
      nextListNodeType: nextListNodeType
    });
  }

  var nodeRangeAroundList = $from.blockRange($to);

  if (!nodeRangeAroundList) {
    return;
  }

  var parentNode = nodeRangeAroundList.parent;
  var startIndex = nodeRangeAroundList.startIndex,
      endIndex = nodeRangeAroundList.endIndex,
      depth = nodeRangeAroundList.depth; // Checking for invalid nodes to prevent conversion
  // eg. a panel cannot be wrapped in a list so return
  // It will skip this check if the selection begins within a list
  // This is to match the behaviour of the toolbar buttons being disabled

  if (!findFirstParentListNode($from)) {
    for (var i = startIndex; i < endIndex; i++) {
      var position = nodeRangeAroundList.$from.posAtIndex(i, depth);
      var resolvedPosition = doc.resolve(position);
      var currentChild = parentNode.child(i);
      var currentNodeRange = resolvedPosition.blockRange(tr.doc.resolve(position + currentChild.nodeSize));

      if (currentNodeRange && !isListNode(currentChild) && !findWrapping(currentNodeRange, nextListNodeType)) {
        return;
      }
    }
  } // Checking for any non list nodes and wrapping them in a list
  // so they can be converted


  tr.doc.nodesBetween(nodeRangeAroundList.start, nodeRangeAroundList.end, function (node, pos) {
    // Skip over any nodes that are part of a list
    if (findFirstParentListNode(tr.doc.resolve(tr.mapping.map(pos)))) {
      return false;
    } // The following applies to suitable nodes that are not within a list


    var currentNodeNotWrappedInList = node;
    var isNotAnEmptyParagraphAndIsParagraphOrLeafNode = !isEmptyParagraph(currentNodeNotWrappedInList) && (!node.type.isBlock || node.type.name === 'paragraph');

    if (isNotAnEmptyParagraphAndIsParagraphOrLeafNode && nodeRangeAroundList) {
      var remainingNodeRange = new NodeRange(tr.doc.resolve(tr.mapping.map(pos)), tr.doc.resolve(tr.mapping.map(pos) + currentNodeNotWrappedInList.nodeSize), nodeRangeAroundList.depth);
      convertAroundList({
        tr: tr,
        nextListNodeType: nextListNodeType,
        nodeRange: remainingNodeRange
      });
      return false;
    }
  });
  convertSelectedList({
    tr: tr,
    nextListNodeType: nextListNodeType
  });

  if (tr.docChanged) {
    joinSiblingLists({
      tr: tr,
      forceListType: nextListNodeType
    });
  }
}

var convertSelectedList = function convertSelectedList(_ref2) {
  var tr = _ref2.tr,
      nextListNodeType = _ref2.nextListNodeType;
  var selection = tr.selection,
      _tr$selection2 = tr.selection,
      from = _tr$selection2.from,
      to = _tr$selection2.to;
  var codeBlock = tr.doc.type.schema.nodes.codeBlock; // get the positions of all the leaf nodes within the selection

  var nodePositions = [];

  if (selection instanceof TextSelection && selection.$cursor || selection instanceof GapCursorSelection) {
    nodePositions.push(from);
  } else {
    // nodesBetween doesn't return leaf nodes that are outside of from and to
    tr.doc.nodesBetween(from, to, function (node, pos) {
      // isLeaf is false for empty codeBlock so adding additional check for childCount
      if (!node.isLeaf && !(node.type === codeBlock && node.childCount === 0)) {
        return true;
      }

      nodePositions.push(pos);
    });
  } // use those positions to get the closest parent list nodes


  nodePositions.reduce(function (acc, pos) {
    var closestParentListNode = findParentNodeClosestToPos(tr.doc.resolve(pos), isListNode);

    if (!closestParentListNode) {
      return acc;
    } // don't add duplicates if the parent has already been added into the array


    var existingParent = acc.find(function (node) {
      return node.pos === closestParentListNode.pos && node.start === closestParentListNode.start && node.depth === closestParentListNode.depth;
    });

    if (!existingParent) {
      acc.push(closestParentListNode);
    }

    return acc;
  }, []).forEach(function (item) {
    tr.setNodeMarkup(item.pos, nextListNodeType);
  });
};

var convertAroundList = function convertAroundList(_ref3) {
  var tr = _ref3.tr,
      nextListNodeType = _ref3.nextListNodeType,
      nodeRange = _ref3.nodeRange;

  for (var i = nodeRange.endIndex - 1; i >= nodeRange.startIndex; i--) {
    // @ts-ignore posAtIndex is a public API but has no type yet
    var position = nodeRange.$from.posAtIndex(i, nodeRange.depth);
    var resolvedPos = tr.doc.resolve(position + 1);
    var range = resolvedPos.blockRange(resolvedPos);

    if (!range) {
      return;
    }

    var wrappings = findWrapping(range, nextListNodeType);

    if (!range || !wrappings) {
      return;
    }

    tr.wrap(range, wrappings);
  }
};