import { keymap } from 'prosemirror-keymap';
import { getLinkMatch } from '@atlaskit/adf-schema';
import * as keymaps from '../../../keymaps';
import { stateKey } from '../pm-plugins/main';
import { showLinkToolbar, hideLinkToolbar } from '../commands';
import { INPUT_METHOD, addAnalytics } from '../../analytics';
import { getLinkCreationAnalyticsEvent } from '../analytics';
import { findFilepaths, isLinkInMatches } from '../utils';
export function createKeymapPlugin(skipAnalytics = false) {
  const list = {};
  keymaps.bindKeymapWithCommand(keymaps.addLink.common, showLinkToolbar(INPUT_METHOD.SHORTCUT), list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, mayConvertLastWordToHyperlink(skipAnalytics), list);
  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, mayConvertLastWordToHyperlink(skipAnalytics), list);
  keymaps.bindKeymapWithCommand(keymaps.escape.common, (state, dispatch, view) => {
    const hyperlinkPlugin = stateKey.getState(state);

    if (hyperlinkPlugin.activeLinkMark) {
      hideLinkToolbar()(state, dispatch);

      if (view) {
        view.focus();
      }

      return false;
    }

    return false;
  }, list);
  return keymap(list);
}

const mayConvertLastWordToHyperlink = skipAnalytics => {
  return function (state, dispatch) {
    const nodeBefore = state.selection.$from.nodeBefore;

    if (!nodeBefore || !nodeBefore.isText || !nodeBefore.text) {
      return false;
    }

    const words = nodeBefore.text.split(' ');
    const lastWord = words[words.length - 1];
    const match = getLinkMatch(lastWord);

    if (match) {
      const hyperlinkedText = match.raw;
      const start = state.selection.$from.pos - hyperlinkedText.length;
      const end = state.selection.$from.pos;

      if (state.doc.rangeHasMark(start, end, state.schema.marks.link)) {
        return false;
      }

      const url = match.url;
      const markType = state.schema.mark('link', {
        href: url
      });
      const filepaths = findFilepaths(nodeBefore.text, start - (nodeBefore.text.length - hyperlinkedText.length) // The position referenced by 'start' is relative to the start of the document, findFilepaths deals with index in a node only.
      );

      if (isLinkInMatches(start, filepaths)) {
        return false;
      }

      const tr = state.tr.addMark(start, end, markType);

      if (dispatch) {
        if (skipAnalytics) {
          dispatch(tr);
        } else {
          dispatch(addAnalytics(state, tr, getLinkCreationAnalyticsEvent(INPUT_METHOD.AUTO_DETECT, url)));
        }
      }
    }

    return false;
  };
};

export default createKeymapPlugin;