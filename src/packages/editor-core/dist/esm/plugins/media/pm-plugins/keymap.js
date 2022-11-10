import { keymap } from 'prosemirror-keymap';
import { NodeSelection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { stateKey } from '../pm-plugins/plugin-key';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { insertAndSelectCaptionFromMediaSinglePos, selectCaptionFromMediaSinglePos } from '../commands/captions';
export function keymapPlugin(options) {
  var list = {};

  var _ref = options || {},
      featureFlags = _ref.featureFlags;

  keymaps.bindKeymapWithCommand(keymaps.undo.common, ignoreLinksInSteps, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, splitMediaGroup, list);

  if (getMediaFeatureFlag('captions', featureFlags)) {
    keymaps.bindKeymapWithCommand(keymaps.moveDown.common, insertAndSelectCaption, list);
    keymaps.bindKeymapWithCommand(keymaps.tab.common, insertAndSelectCaption, list);
  }

  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, splitMediaGroup, list);
  return keymap(list);
}

var ignoreLinksInSteps = function ignoreLinksInSteps(state) {
  var mediaPluginState = stateKey.getState(state);
  mediaPluginState.ignoreLinks = true;
  return false;
};

var splitMediaGroup = function splitMediaGroup(state) {
  var mediaPluginState = stateKey.getState(state);
  return mediaPluginState.splitMediaGroup();
};

var insertAndSelectCaption = function insertAndSelectCaption(state, dispatch) {
  var selection = state.selection,
      schema = state.schema;

  if (selection instanceof NodeSelection && selection.node.type === schema.nodes.mediaSingle && schema.nodes.caption) {
    if (dispatch) {
      var from = selection.from,
          node = selection.node;

      if (!insertAndSelectCaptionFromMediaSinglePos(from, node)(state, dispatch)) {
        selectCaptionFromMediaSinglePos(from, node)(state, dispatch);
      }
    }

    return true;
  }

  return false;
};

export default keymapPlugin;