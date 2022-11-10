"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.atTheBeginningOfBlock = atTheBeginningOfBlock;
exports.atTheBeginningOfDoc = atTheBeginningOfDoc;
exports.atTheEndOfBlock = atTheEndOfBlock;
exports.atTheEndOfDoc = atTheEndOfDoc;
exports.endPositionOfParent = endPositionOfParent;
exports.startPositionOfParent = startPositionOfParent;

var _prosemirrorState = require("prosemirror-state");

var _selection = require("../../plugins/selection/gap-cursor/selection");

function atTheEndOfDoc(state) {
  var selection = state.selection,
      doc = state.doc;
  return doc.nodeSize - selection.$to.pos - 2 === selection.$to.depth;
}

function atTheBeginningOfDoc(state) {
  var selection = state.selection;
  return selection.$from.pos === selection.$from.depth;
}

function atTheEndOfBlock(state) {
  var selection = state.selection;
  var $to = selection.$to;

  if (selection instanceof _selection.GapCursorSelection) {
    return false;
  }

  if (selection instanceof _prosemirrorState.NodeSelection && selection.node.isBlock) {
    return true;
  }

  return endPositionOfParent($to) === $to.pos + 1;
}

function atTheBeginningOfBlock(state) {
  var selection = state.selection;
  var $from = selection.$from;

  if (selection instanceof _selection.GapCursorSelection) {
    return false;
  }

  if (selection instanceof _prosemirrorState.NodeSelection && selection.node.isBlock) {
    return true;
  }

  return startPositionOfParent($from) === $from.pos;
}

function startPositionOfParent(resolvedPos) {
  return resolvedPos.start(resolvedPos.depth);
}

function endPositionOfParent(resolvedPos) {
  return resolvedPos.end(resolvedPos.depth) + 1;
}