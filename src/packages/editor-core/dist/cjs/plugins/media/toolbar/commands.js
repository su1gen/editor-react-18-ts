"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeInlineCard = exports.changeMediaCardToInline = exports.changeInlineToMediaCard = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _analytics = require("../../analytics");

var _utils = require("./utils");

var changeInlineToMediaCard = function changeInlineToMediaCard(state, dispatch) {
  var _state$schema$nodes = state.schema.nodes,
      media = _state$schema$nodes.media,
      mediaInline = _state$schema$nodes.mediaInline,
      mediaGroup = _state$schema$nodes.mediaGroup;
  var selectedNode = state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node.type === mediaInline && state.selection.node;

  if (!selectedNode) {
    return false;
  }

  var _selectedNode$attrs = selectedNode.attrs,
      id = _selectedNode$attrs.id,
      type = _selectedNode$attrs.type,
      collection = _selectedNode$attrs.collection;
  var mediaNode = media.createChecked({
    id: id,
    type: type,
    collection: collection
  });
  var group = mediaGroup.createChecked({}, mediaNode);
  var nodePos = state.tr.doc.resolve(state.selection.from).end();
  var tr = state.tr;
  tr = (0, _prosemirrorUtils.removeSelectedNode)(tr);
  tr = (0, _prosemirrorUtils.safeInsert)(group, nodePos, true)(tr);

  if (dispatch) {
    (0, _analytics.addAnalytics)(state, tr, {
      action: _analytics.ACTION.CHANGED_TYPE,
      actionSubject: _analytics.ACTION_SUBJECT.MEDIA,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        newType: _analytics.ACTION_SUBJECT_ID.MEDIA_GROUP,
        previousType: _analytics.ACTION_SUBJECT_ID.MEDIA_INLINE
      }
    });
    dispatch(tr);
  }

  return true;
};

exports.changeInlineToMediaCard = changeInlineToMediaCard;

var changeMediaCardToInline = function changeMediaCardToInline(state, dispatch) {
  var _state$schema$nodes2 = state.schema.nodes,
      media = _state$schema$nodes2.media,
      mediaInline = _state$schema$nodes2.mediaInline,
      paragraph = _state$schema$nodes2.paragraph;
  var selectedNode = state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node;

  if (!selectedNode || !selectedNode.type === media) {
    return false;
  }

  var mediaInlineNode = mediaInline.create({
    id: selectedNode.attrs.id,
    collection: selectedNode.attrs.collection
  });
  var space = state.schema.text(' ');

  var content = _prosemirrorModel.Fragment.from([mediaInlineNode, space]);

  var node = paragraph.createChecked({}, content);
  var nodePos = state.tr.doc.resolve(state.selection.from).start() - 1;
  var tr = (0, _utils.removeMediaGroupNode)(state);
  tr = (0, _prosemirrorUtils.safeInsert)(node, nodePos, true)(tr);

  if (dispatch) {
    (0, _analytics.addAnalytics)(state, tr, {
      action: _analytics.ACTION.CHANGED_TYPE,
      actionSubject: _analytics.ACTION_SUBJECT.MEDIA,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        newType: _analytics.ACTION_SUBJECT_ID.MEDIA_INLINE,
        previousType: _analytics.ACTION_SUBJECT_ID.MEDIA_GROUP
      }
    });
    dispatch(tr);
  }

  return true;
};

exports.changeMediaCardToInline = changeMediaCardToInline;

var removeInlineCard = function removeInlineCard(state, dispatch) {
  if ((0, _prosemirrorUtils.isNodeSelection)(state.selection)) {
    if (dispatch) {
      dispatch((0, _prosemirrorUtils.removeSelectedNode)(state.tr));
    }

    return true;
  }

  return false;
};

exports.removeInlineCard = removeInlineCard;