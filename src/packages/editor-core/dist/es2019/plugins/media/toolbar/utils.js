import { getMediaClient } from '@atlaskit/media-client';
import { findParentNodeOfType, removeParentNodeOfType, removeSelectedNode } from 'prosemirror-utils';
export const getSelectedMediaContainerNodeAttrs = mediaPluginState => {
  const selectedNode = mediaPluginState.selectedMediaContainerNode();

  if (selectedNode && selectedNode.attrs) {
    return selectedNode.attrs;
  }

  return null;
};
export const downloadMedia = async mediaPluginState => {
  try {
    const selectedNodeAttrs = getSelectedMediaContainerNodeAttrs(mediaPluginState);

    if (selectedNodeAttrs && mediaPluginState.mediaClientConfig) {
      const {
        id,
        collection = ''
      } = selectedNodeAttrs;
      const mediaClient = getMediaClient(mediaPluginState.mediaClientConfig);
      const fileState = await mediaClient.file.getCurrentState(id, {
        collectionName: collection
      });
      const fileName = fileState.status === 'error' ? undefined : fileState.name;
      mediaClient.file.downloadBinary(id, fileName, collection);
    }

    return true;
  } catch (err) {
    return false;
  }
};
export const removeMediaGroupNode = state => {
  const {
    mediaGroup
  } = state.schema.nodes;
  const mediaGroupParent = findParentNodeOfType(mediaGroup)(state.selection);
  let tr = state.tr; // If it is the last media group in filmstrip, remove the entire filmstrip

  if (mediaGroupParent && mediaGroupParent.node.childCount === 1) {
    tr = removeParentNodeOfType(mediaGroup)(tr);
  } else {
    tr = removeSelectedNode(tr);
  }

  return tr;
};