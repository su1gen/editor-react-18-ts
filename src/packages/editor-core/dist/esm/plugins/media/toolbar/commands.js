import { Fragment } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
import { isNodeSelection, removeSelectedNode, safeInsert } from 'prosemirror-utils';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE } from '../../analytics';
import { removeMediaGroupNode } from './utils';
export var changeInlineToMediaCard = function changeInlineToMediaCard(state, dispatch) {
  var _state$schema$nodes = state.schema.nodes,
      media = _state$schema$nodes.media,
      mediaInline = _state$schema$nodes.mediaInline,
      mediaGroup = _state$schema$nodes.mediaGroup;
  var selectedNode = state.selection instanceof NodeSelection && state.selection.node.type === mediaInline && state.selection.node;

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
  tr = removeSelectedNode(tr);
  tr = safeInsert(group, nodePos, true)(tr);

  if (dispatch) {
    addAnalytics(state, tr, {
      action: ACTION.CHANGED_TYPE,
      actionSubject: ACTION_SUBJECT.MEDIA,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        newType: ACTION_SUBJECT_ID.MEDIA_GROUP,
        previousType: ACTION_SUBJECT_ID.MEDIA_INLINE
      }
    });
    dispatch(tr);
  }

  return true;
};
export var changeMediaCardToInline = function changeMediaCardToInline(state, dispatch) {
  var _state$schema$nodes2 = state.schema.nodes,
      media = _state$schema$nodes2.media,
      mediaInline = _state$schema$nodes2.mediaInline,
      paragraph = _state$schema$nodes2.paragraph;
  var selectedNode = state.selection instanceof NodeSelection && state.selection.node;

  if (!selectedNode || !selectedNode.type === media) {
    return false;
  }

  var mediaInlineNode = mediaInline.create({
    id: selectedNode.attrs.id,
    collection: selectedNode.attrs.collection
  });
  var space = state.schema.text(' ');
  var content = Fragment.from([mediaInlineNode, space]);
  var node = paragraph.createChecked({}, content);
  var nodePos = state.tr.doc.resolve(state.selection.from).start() - 1;
  var tr = removeMediaGroupNode(state);
  tr = safeInsert(node, nodePos, true)(tr);

  if (dispatch) {
    addAnalytics(state, tr, {
      action: ACTION.CHANGED_TYPE,
      actionSubject: ACTION_SUBJECT.MEDIA,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        newType: ACTION_SUBJECT_ID.MEDIA_INLINE,
        previousType: ACTION_SUBJECT_ID.MEDIA_GROUP
      }
    });
    dispatch(tr);
  }

  return true;
};
export var removeInlineCard = function removeInlineCard(state, dispatch) {
  if (isNodeSelection(state.selection)) {
    if (dispatch) {
      dispatch(removeSelectedNode(state.tr));
    }

    return true;
  }

  return false;
};