import { setTextSelection } from 'prosemirror-utils';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE } from '../../analytics';
export const selectCaptionFromMediaSinglePos = (mediaSingleNodePos, mediaSingleNode) => (state, dispatch) => {
  // node should have two children, media and caption
  if (mediaSingleNode.childCount !== 2) {
    return false;
  }

  if (dispatch) {
    const media = mediaSingleNode.child(0);
    const caption = mediaSingleNode.child(1);
    let tr = state.tr;
    tr = setSelectionAtEndOfCaption(tr, mediaSingleNodePos, media.nodeSize, caption.nodeSize);
    tr.setMeta('scrollIntoView', false);
    dispatch(tr);
  }

  return true;
};
export const insertAndSelectCaptionFromMediaSinglePos = (mediaSingleNodePos, mediaSingleNode) => (state, dispatch) => {
  let tr = state.tr; // node should have one child, media

  if (mediaSingleNode.childCount !== 1) {
    return false;
  }

  if (dispatch) {
    const schema = state.schema;
    const media = mediaSingleNode.child(0);
    const caption = schema.nodes.caption.create();
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

const setSelectionAtEndOfCaption = (tr, mediaSingleNodePos, mediaNodeSize, captionNodeSize) => {
  return setTextSelection(mediaSingleNodePos + mediaNodeSize + captionNodeSize)(tr);
};