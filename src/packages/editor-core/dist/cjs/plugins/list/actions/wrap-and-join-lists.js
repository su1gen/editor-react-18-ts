"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapInList = wrapInList;
exports.wrapInListAndJoin = wrapInListAndJoin;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

var _autojoin = require("../../../utils/prosemirror/autojoin");

var _gapCursorSelection = require("../../selection/gap-cursor-selection");

var _selection = require("../utils/selection");

/**
 * Wraps the selection in a list with the given type. If this results in
 * two adjacent lists of the same type, those will be joined together.
 */
function wrapInListAndJoin(nodeType, tr) {
  wrapInList(nodeType)(tr);
  (0, _autojoin.autoJoinTr)(tr, function (before, after) {
    return before.type === after.type && before.type === nodeType;
  });
}
/**
 * Wraps the selection in a list with the given type and attributes.
 *
 * Adapted from https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js#L64-L89
 */


function wrapInList(listType, attrs) {
  return function (tr) {
    var _tr$selection = tr.selection,
        $from = _tr$selection.$from,
        $to = _tr$selection.$to;
    var range;

    if (tr.selection instanceof _gapCursorSelection.GapCursorSelection && $from.nodeAfter && (0, _selection.isWrappingPossible)(listType, tr.selection)) {
      var nodeSize = $from.nodeAfter.nodeSize || 1;
      range = $from.blockRange($from.doc.resolve($from.pos + nodeSize));
    } else {
      range = $from.blockRange($to);
    }

    var doJoin = false;
    var outerRange = range;

    if (!range) {
      return false;
    } // This is at the top of an existing list item


    if (range.depth >= 2 && // @ts-ignore - missing type for compatibleContent
    $from.node(range.depth - 1).type.compatibleContent(listType) && range.startIndex === 0) {
      // Don't do anything if this is the top of the list
      if ($from.index(range.depth - 1) === 0) {
        return false;
      }

      var $insert = tr.doc.resolve(range.start - 2);
      outerRange = new _prosemirrorModel.NodeRange($insert, $insert, range.depth);

      if (range.endIndex < range.parent.childCount) {
        range = new _prosemirrorModel.NodeRange($from, tr.doc.resolve($to.end(range.depth)), range.depth);
      }

      doJoin = true;
    }

    var wrap = (0, _prosemirrorTransform.findWrapping)(outerRange, listType, attrs, range);

    if (!wrap) {
      return false;
    }

    tr = doWrapInList(tr, range, wrap, doJoin, listType);
    return true;
  };
}
/**
 * Internal function used by wrapInList
 *
 * Adapted from https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js#L91-L112
 */


function doWrapInList(tr, range, wrappers, joinBefore, listType) {
  var content = _prosemirrorModel.Fragment.empty;

  for (var i = wrappers.length - 1; i >= 0; i--) {
    content = _prosemirrorModel.Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content));
  }

  tr.step(new _prosemirrorTransform.ReplaceAroundStep(range.start - (joinBefore ? 2 : 0), range.end, range.start, range.end, new _prosemirrorModel.Slice(content, 0, 0), wrappers.length, true));
  var found = 0;

  for (var _i = 0; _i < wrappers.length; _i++) {
    if (wrappers[_i].type === listType) {
      found = _i + 1;
    }
  }

  var splitDepth = wrappers.length - found;
  var splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0);
  var parent = range.parent;

  for (var _i2 = range.startIndex, e = range.endIndex, first = true; _i2 < e; _i2++, first = false) {
    if (!first && (0, _prosemirrorTransform.canSplit)(tr.doc, splitPos, splitDepth)) {
      tr.split(splitPos, splitDepth);
      splitPos += 2 * splitDepth;
    }

    splitPos += parent.child(_i2).nodeSize;
  }

  return tr;
}