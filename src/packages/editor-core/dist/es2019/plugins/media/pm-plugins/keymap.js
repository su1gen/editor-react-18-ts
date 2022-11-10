import { keymap } from 'prosemirror-keymap';
import { NodeSelection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { stateKey } from '../pm-plugins/plugin-key';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { insertAndSelectCaptionFromMediaSinglePos, selectCaptionFromMediaSinglePos } from '../commands/captions';
export function keymapPlugin(options) {
  const list = {};
  const {
    featureFlags
  } = options || {};
  keymaps.bindKeymapWithCommand(keymaps.undo.common, ignoreLinksInSteps, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, splitMediaGroup, list);

  if (getMediaFeatureFlag('captions', featureFlags)) {
    keymaps.bindKeymapWithCommand(keymaps.moveDown.common, insertAndSelectCaption, list);
    keymaps.bindKeymapWithCommand(keymaps.tab.common, insertAndSelectCaption, list);
  }

  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, splitMediaGroup, list);
  return keymap(list);
}

const ignoreLinksInSteps = state => {
  const mediaPluginState = stateKey.getState(state);
  mediaPluginState.ignoreLinks = true;
  return false;
};

const splitMediaGroup = state => {
  const mediaPluginState = stateKey.getState(state);
  return mediaPluginState.splitMediaGroup();
};

const insertAndSelectCaption = (state, dispatch) => {
  const {
    selection,
    schema
  } = state;

  if (selection instanceof NodeSelection && selection.node.type === schema.nodes.mediaSingle && schema.nodes.caption) {
    if (dispatch) {
      const {
        from,
        node
      } = selection;

      if (!insertAndSelectCaptionFromMediaSinglePos(from, node)(state, dispatch)) {
        selectCaptionFromMediaSinglePos(from, node)(state, dispatch);
      }
    }

    return true;
  }

  return false;
};

export default keymapPlugin;