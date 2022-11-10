"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSelectionNearPos = exports.setNodeSelectionNearPos = exports.mayGetStatusAtSelection = exports.mayGetStatusAtPos = exports.isEmptyStatus = void 0;

var _prosemirrorState = require("prosemirror-state");

var mayGetStatusAtSelection = function mayGetStatusAtSelection(selection) {
  if (selection && selection instanceof _prosemirrorState.NodeSelection) {
    var nodeSelection = selection;

    if (nodeSelection.node.type.name === 'status') {
      return selection.node.attrs || null;
    }
  }

  return null;
};

exports.mayGetStatusAtSelection = mayGetStatusAtSelection;

var mayGetStatusAtPos = function mayGetStatusAtPos(pos, doc) {
  if (pos) {
    var node = doc.nodeAt(pos);

    if (node && node.type.name === 'status') {
      return node.attrs;
    }
  }

  return null;
};

exports.mayGetStatusAtPos = mayGetStatusAtPos;

var isEmptyStatus = function isEmptyStatus(node) {
  return node && (node.text && node.text.trim().length === 0 || node.text === '');
};

exports.isEmptyStatus = isEmptyStatus;

var setSelectionNearPos = function setSelectionNearPos(tr, pos) {
  return tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(tr.mapping.map(pos))));
};

exports.setSelectionNearPos = setSelectionNearPos;

var setNodeSelectionNearPos = function setNodeSelectionNearPos(tr, pos) {
  return tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, tr.mapping.map(pos)));
};

exports.setNodeSelectionNearPos = setNodeSelectionNearPos;