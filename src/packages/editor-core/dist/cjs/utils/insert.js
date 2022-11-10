"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldSplitSelectedNodeOnNodeInsertion = exports.safeInsert = exports.insertSelectedItem = exports.LookDirection = void 0;

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _document = require("./document");

var _gapCursorSelection = require("../plugins/selection/gap-cursor-selection");

var _selection = require("./selection");

var LookDirection;
exports.LookDirection = LookDirection;

(function (LookDirection) {
  LookDirection["Before"] = "before";
  LookDirection["After"] = "after";
})(LookDirection || (exports.LookDirection = LookDirection = {}));

var isLastChild = function isLastChild($pos, doc) {
  return doc.resolve($pos.after()).node().lastChild === $pos.node();
};

var isFirstChild = function isFirstChild($pos, doc) {
  return doc.resolve($pos.before()).node().firstChild === $pos.node();
};

var nodeIsInsideAList = function nodeIsInsideAList(tr) {
  var nodes = tr.doc.type.schema.nodes;
  return (0, _prosemirrorUtils.hasParentNodeOfType)([nodes.orderedList, nodes.bulletList])(tr.selection);
};

var insertBeforeOrAfter = function insertBeforeOrAfter(tr, lookDirection, $parentPos, $proposedPosition, content) {
  /**
   * This block caters for the first item in a parent with the cursor being at the very start
   * or the last item with the cursor being at the very end
   *
   * e.g.
   * ul
   *  li {<>}Scenario one
   *  li
   *  li Scenario two{<>}
   */
  if (isFirstChild($proposedPosition, tr.doc) && lookDirection === LookDirection.Before || isLastChild($proposedPosition, tr.doc) && lookDirection === LookDirection.After) {
    return tr.insert($parentPos[lookDirection](), content);
  }

  return tr.insert($proposedPosition[lookDirection](), content);
}; // FIXME: A more sustainable and configurable way to choose when to split


var shouldSplit = function shouldSplit(nodeType, schemaNodes) {
  return [schemaNodes.bulletList, schemaNodes.orderedList, schemaNodes.panel].includes(nodeType);
};

var safeInsert = function safeInsert(content, position) {
  return function (tr) {
    var _tr$selection$$from$n;

    var nodes = tr.doc.type.schema.nodes;
    var whitelist = [nodes.rule, nodes.mediaSingle]; // fallback if the node to insert is not in the whitelist, or if the insertion should happen within a list.

    if (content instanceof _prosemirrorModel.Fragment || !whitelist.includes(content.type) || nodeIsInsideAList(tr)) {
      return null;
    } // Check for selection


    if (!tr.selection.empty || (0, _prosemirrorUtils.isNodeSelection)(tr.selection)) {
      // NOT IMPLEMENTED
      return null;
    }

    var $from = tr.selection.$from;
    var $insertPos = position ? tr.doc.resolve(position) : (0, _prosemirrorUtils.isNodeSelection)(tr.selection) ? tr.doc.resolve($from.pos + 1) : $from;
    var lookDirection;
    var insertPosEnd = $insertPos.end();
    var insertPosStart = $insertPos.start(); // When parent node is an empty paragraph,
    // check the empty paragraph is the first or last node of its parent.

    if ((0, _document.isEmptyParagraph)($insertPos.parent)) {
      if (isLastChild($insertPos, tr.doc)) {
        lookDirection = LookDirection.After;
      } else if (isFirstChild($insertPos, tr.doc)) {
        lookDirection = LookDirection.Before;
      }
    } else {
      if ($insertPos.pos === insertPosEnd) {
        lookDirection = LookDirection.After;
      } else if ($insertPos.pos === insertPosStart) {
        lookDirection = LookDirection.Before;
      }
    }

    var grandParentNodeType = (_tr$selection$$from$n = tr.selection.$from.node(-1)) === null || _tr$selection$$from$n === void 0 ? void 0 : _tr$selection$$from$n.type;
    var parentNodeType = tr.selection.$from.parent.type;

    if (!lookDirection && !shouldSplitSelectedNodeOnNodeInsertion({
      parentNodeType: parentNodeType,
      grandParentNodeType: grandParentNodeType,
      content: content
    })) {
      // node to be inserted is an invalid child of selection so insert below selected node
      return (0, _prosemirrorUtils.safeInsert)(content, tr.selection.from)(tr);
    }

    if (!lookDirection) {
      // fallback to consumer for now
      return null;
    } // Replace empty paragraph


    if ((0, _document.isEmptyParagraph)($insertPos.parent) && (0, _prosemirrorUtils.canInsert)(tr.doc.resolve($insertPos[lookDirection]()), content)) {
      return finaliseInsert(tr.replaceWith($insertPos.before(), $insertPos.after(), content), -1);
    }

    var $proposedPosition = $insertPos;

    while ($proposedPosition.depth > 0) {
      var $parentPos = tr.doc.resolve($proposedPosition[lookDirection]());
      var parentNode = $parentPos.node(); // Insert at position (before or after target pos)

      if ((0, _prosemirrorUtils.canInsert)($proposedPosition, content)) {
        return finaliseInsert(tr.insert($proposedPosition.pos, content), content.nodeSize);
      } // If we can't insert, and we think we should split, we fallback to consumer for now


      if (shouldSplit(parentNode.type, tr.doc.type.schema.nodes)) {
        return finaliseInsert(insertBeforeOrAfter(tr, lookDirection, $parentPos, $proposedPosition, content), content.nodeSize);
      } // Can not insert into current parent, step up one parent


      $proposedPosition = $parentPos;
    }

    return finaliseInsert(tr.insert($proposedPosition.pos, content), content.nodeSize);
  };
};

exports.safeInsert = safeInsert;

var finaliseInsert = function finaliseInsert(tr, nodeLength) {
  var lastStep = tr.steps[tr.steps.length - 1];

  if (!(lastStep instanceof _prosemirrorTransform.ReplaceStep || lastStep instanceof _prosemirrorTransform.ReplaceAroundStep)) {
    return null;
  } // Place gap cursor after the newly inserted node


  var gapCursorPos = lastStep.to + lastStep.slice.openStart + nodeLength;
  return tr.setSelection(new _gapCursorSelection.GapCursorSelection(tr.doc.resolve(gapCursorPos), _gapCursorSelection.Side.RIGHT)).scrollIntoView();
};
/**
 * Method extracted from typeahed plugin to be shared with the element browser on handling element insertion.
 */


var insertSelectedItem = function insertSelectedItem(maybeNode) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (state, tr, start) {
    if (!maybeNode) {
      return tr;
    }

    var isInputFragment = maybeNode instanceof _prosemirrorModel.Fragment;
    var node;

    try {
      node = maybeNode instanceof _prosemirrorModel.Node || isInputFragment ? maybeNode : typeof maybeNode === 'string' ? state.schema.text(maybeNode) : _prosemirrorModel.Node.fromJSON(state.schema, maybeNode);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return tr;
    }

    if (node.isText) {
      tr = tr.replaceWith(start, start, node);
      /**
       *
       * Replacing a type ahead query mark with a block node.
       *
       */
    } else if (node.isBlock) {
      tr = (0, _prosemirrorUtils.safeInsert)((0, _selection.normaliseNestedLayout)(state, node), undefined, true)(tr);
      /**
       *
       * Replacing a type ahead query mark with an inline node.
       *
       */
    } else if (node.isInline || isInputFragment) {
      var fragment = isInputFragment ? node : _prosemirrorModel.Fragment.fromArray([node, state.schema.text(' ')]);
      tr = tr.replaceWith(start, start, fragment);

      if (opts.selectInlineNode) {
        // Select inserted node
        tr = tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, start));
      } else {
        // Placing cursor after node + space.
        tr = tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(start + fragment.size)));
      }
    }

    return tr;
  };
};
/**
 * ED-14584: Util to check if the destination node is a paragraph & the
 * content being inserted is a valid child of the grandparent node.
 * In this case, the destination node should split
 */


exports.insertSelectedItem = insertSelectedItem;

var shouldSplitSelectedNodeOnNodeInsertion = function shouldSplitSelectedNodeOnNodeInsertion(_ref) {
  var parentNodeType = _ref.parentNodeType,
      grandParentNodeType = _ref.grandParentNodeType,
      content = _ref.content;

  if (parentNodeType.name === 'doc' || parentNodeType.name === 'paragraph' && grandParentNodeType.validContent(_prosemirrorModel.Fragment.from(content))) {
    return true;
  }

  return false;
};

exports.shouldSplitSelectedNodeOnNodeInsertion = shouldSplitSelectedNodeOnNodeInsertion;