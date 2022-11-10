"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectCaptionFromMediaSinglePos = exports.insertAndSelectCaptionFromMediaSinglePos = void 0;

var _prosemirrorUtils = require("prosemirror-utils");

var _analytics = require("../../analytics");

var selectCaptionFromMediaSinglePos = function selectCaptionFromMediaSinglePos(mediaSingleNodePos, mediaSingleNode) {
  return function (state, dispatch) {
    // node should have two children, media and caption
    if (mediaSingleNode.childCount !== 2) {
      return false;
    }

    if (dispatch) {
      var media = mediaSingleNode.child(0);
      var caption = mediaSingleNode.child(1);
      var tr = state.tr;
      tr = setSelectionAtEndOfCaption(tr, mediaSingleNodePos, media.nodeSize, caption.nodeSize);
      tr.setMeta('scrollIntoView', false);
      dispatch(tr);
    }

    return true;
  };
};

exports.selectCaptionFromMediaSinglePos = selectCaptionFromMediaSinglePos;

var insertAndSelectCaptionFromMediaSinglePos = function insertAndSelectCaptionFromMediaSinglePos(mediaSingleNodePos, mediaSingleNode) {
  return function (state, dispatch) {
    var tr = state.tr; // node should have one child, media

    if (mediaSingleNode.childCount !== 1) {
      return false;
    }

    if (dispatch) {
      var schema = state.schema;
      var media = mediaSingleNode.child(0);
      var caption = schema.nodes.caption.create();
      tr = state.tr.insert(mediaSingleNodePos + media.nodeSize + 1, caption);
      tr = setSelectionAtEndOfCaption(tr, mediaSingleNodePos, media.nodeSize, caption.nodeSize);
      tr.setMeta('scrollIntoView', false);
      (0, _analytics.addAnalytics)(state, tr, {
        action: _analytics.ACTION.ADDED,
        eventType: _analytics.EVENT_TYPE.TRACK,
        actionSubject: _analytics.ACTION_SUBJECT.MEDIA_SINGLE,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.CAPTION
      });
      dispatch(tr);
    }

    return true;
  };
};

exports.insertAndSelectCaptionFromMediaSinglePos = insertAndSelectCaptionFromMediaSinglePos;

var setSelectionAtEndOfCaption = function setSelectionAtEndOfCaption(tr, mediaSingleNodePos, mediaNodeSize, captionNodeSize) {
  return (0, _prosemirrorUtils.setTextSelection)(mediaSingleNodePos + mediaNodeSize + captionNodeSize)(tr);
};