"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMediaSelected = exports.createExternalMediaNode = exports.canInsertMedia = void 0;

var _prosemirrorState = require("prosemirror-state");

var isMediaSelected = function isMediaSelected(state) {
  var media = state.schema.nodes.media;
  return state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node.type === media;
};

exports.isMediaSelected = isMediaSelected;

var canInsertMedia = function canInsertMedia(state) {
  var mediaSingle = state.schema.nodes.mediaSingle;
  var $to = state.selection.$to;

  if (mediaSingle) {
    for (var d = $to.depth; d >= 0; d--) {
      var index = $to.index(d);

      if ($to.node(d).canReplaceWith(index, index, mediaSingle)) {
        return true;
      }
    }
  }

  return false;
};

exports.canInsertMedia = canInsertMedia;

var createExternalMediaNode = function createExternalMediaNode(url, schema) {
  var _schema$nodes = schema.nodes,
      media = _schema$nodes.media,
      mediaSingle = _schema$nodes.mediaSingle;

  if (!media || !mediaSingle) {
    return null;
  }

  var mediaNode = media.createChecked({
    type: 'external',
    url: url
  });
  return mediaSingle.createChecked({}, mediaNode);
};

exports.createExternalMediaNode = createExternalMediaNode;