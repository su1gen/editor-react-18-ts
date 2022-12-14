import { NodeSelection } from 'prosemirror-state';
export const isMediaSelected = state => {
  const {
    media
  } = state.schema.nodes;
  return state.selection instanceof NodeSelection && state.selection.node.type === media;
};
export const canInsertMedia = state => {
  const {
    mediaSingle
  } = state.schema.nodes;
  const {
    $to
  } = state.selection;

  if (mediaSingle) {
    for (let d = $to.depth; d >= 0; d--) {
      let index = $to.index(d);

      if ($to.node(d).canReplaceWith(index, index, mediaSingle)) {
        return true;
      }
    }
  }

  return false;
};
export const createExternalMediaNode = (url, schema) => {
  const {
    media,
    mediaSingle
  } = schema.nodes;

  if (!media || !mediaSingle) {
    return null;
  }

  const mediaNode = media.createChecked({
    type: 'external',
    url
  });
  return mediaSingle.createChecked({}, mediaNode);
};