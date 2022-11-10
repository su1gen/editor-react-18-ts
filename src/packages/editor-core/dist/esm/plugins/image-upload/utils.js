import { NodeSelection } from 'prosemirror-state';
export var isMediaSelected = function isMediaSelected(state) {
  var media = state.schema.nodes.media;
  return state.selection instanceof NodeSelection && state.selection.node.type === media;
};
export var canInsertMedia = function canInsertMedia(state) {
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
export var createExternalMediaNode = function createExternalMediaNode(url, schema) {
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