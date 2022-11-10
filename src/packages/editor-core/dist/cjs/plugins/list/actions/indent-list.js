"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indentList = void 0;

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorModel = require("prosemirror-model");

// adapted from https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js#L206:L231
var indentList = function indentList(tr) {
  var _tr$selection = tr.selection,
      $from = _tr$selection.$from,
      $to = _tr$selection.$to;
  var listItem = tr.doc.type.schema.nodes.listItem;
  var range = $from.blockRange($to, function (node) {
    return !!node.childCount && !!node.firstChild && node.firstChild.type === listItem;
  });

  if (!range) {
    return false;
  } // get the index of the selected list item in the list it is part of


  var startIndex = range.startIndex;

  if (startIndex === 0) {
    return false;
  } // get the parent list of the list item(s) in the selected range


  var parent = range.parent; // get the list immediately before the selection start

  var previousListItem = parent.child(startIndex - 1);

  if (previousListItem.type !== listItem) {
    return false;
  } // if that list was nested, join the selected list items into the same
  // nested list; if not, create a new child list of the same type and
  // nest it under the current level


  var isPreviousListNested = previousListItem.lastChild && ['bulletList', 'orderedList'].includes(previousListItem.lastChild.type.name);

  var inner = _prosemirrorModel.Fragment.from(isPreviousListNested ? listItem.create() : undefined);

  var nextListNodeType = isPreviousListNested ? previousListItem.lastChild.type : parent.type;

  var nextListNodeContent = _prosemirrorModel.Fragment.from(nextListNodeType.create(null, inner));

  var slice = new _prosemirrorModel.Slice(_prosemirrorModel.Fragment.from(listItem.create(null, nextListNodeContent)), isPreviousListNested ? 3 : 1, 0);
  var before = range.start;
  var after = range.end;
  tr.step(new _prosemirrorTransform.ReplaceAroundStep(before - (isPreviousListNested ? 3 : 1), after, before, after, slice, 1, true));
};

exports.indentList = indentList;