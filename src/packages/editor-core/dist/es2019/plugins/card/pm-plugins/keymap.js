import { keymap } from 'prosemirror-keymap';
import { NodeSelection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { findChildren, flatten } from 'prosemirror-utils';
import { browser } from '@atlaskit/editor-common/utils';
const lookupPixel = 10;

const getClosestInlineCardPos = (state, editorView, direction) => {
  var _editorView$posAtCoor;

  const {
    selection
  } = state;
  const {
    parent
  } = selection.$from;
  const inlineCardType = state.schema.nodes.inlineCard;

  if (!flatten(parent, false).some(({
    node
  }) => node.type === inlineCardType)) {
    return null;
  }

  const coord = editorView.coordsAtPos(selection.$anchor.pos);
  const nearPos = (_editorView$posAtCoor = editorView.posAtCoords({
    left: coord.left,
    top: direction === 'up' ? coord.top - lookupPixel : coord.bottom + lookupPixel
  })) === null || _editorView$posAtCoor === void 0 ? void 0 : _editorView$posAtCoor.pos;

  if (nearPos) {
    const newNode = state.doc.nodeAt(nearPos);

    if (newNode) {
      if (newNode.type !== inlineCardType || findChildren(parent, node => node === newNode, false).length === 0 || newNode === selection.node) {
        return null;
      }

      return nearPos;
    }
  }

  return null;
};

const selectAboveBelowInlineCard = direction => {
  return (state, dispatch, editorView) => {
    if (!editorView || !dispatch) {
      return false;
    }

    const pos = getClosestInlineCardPos(state, editorView, direction);

    if (pos) {
      dispatch(state.tr.setSelection(new NodeSelection(state.doc.resolve(pos))));
      return true;
    }

    return false;
  };
};

export function cardKeymap(featureFlags) {
  const list = {}; // https://bugs.chromium.org/p/chromium/issues/detail?id=1227468 introduced since Chrome 91

  if (browser.chrome && browser.chrome_version > 90 && featureFlags.chromeCursorHandlerFixedVersion && browser.chrome_version < featureFlags.chromeCursorHandlerFixedVersion) {
    keymaps.bindKeymapWithCommand(keymaps.moveUp.common, selectAboveBelowInlineCard('up'), list);
    keymaps.bindKeymapWithCommand(keymaps.moveDown.common, selectAboveBelowInlineCard('down'), list);
  }

  return keymap(list);
}