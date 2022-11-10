import { setTextSelection } from 'prosemirror-utils';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE } from '../../analytics';
export var selectCaptionFromMediaSinglePos = function selectCaptionFromMediaSinglePos(mediaSingleNodePos, mediaSingleNode) {
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
export var insertAndSelectCaptionFromMediaSinglePos = function insertAndSelectCaptionFromMediaSinglePos(mediaSingleNodePos, mediaSingleNode) {
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
      addAnalytics(state, tr, {
        action: ACTION.ADDED,
        eventType: EVENT_TYPE.TRACK,
        actionSubject: ACTION_SUBJECT.MEDIA_SINGLE,
        actionSubjectId: ACTION_SUBJECT_ID.CAPTION
      });
      dispatch(tr);
    }

    return true;
  };
};

var setSelectionAtEndOfCaption = function setSelectionAtEndOfCaption(tr, mediaSingleNodePos, mediaNodeSize, captionNodeSize) {
  return setTextSelection(mediaSingleNodePos + mediaNodeSize + captionNodeSize)(tr);
};