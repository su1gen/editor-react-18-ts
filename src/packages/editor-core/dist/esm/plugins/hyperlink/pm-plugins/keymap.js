import { keymap } from 'prosemirror-keymap';
import { getLinkMatch } from '@atlaskit/adf-schema';
import * as keymaps from '../../../keymaps';
import { stateKey } from '../pm-plugins/main';
import { showLinkToolbar, hideLinkToolbar } from '../commands';
import { INPUT_METHOD, addAnalytics } from '../../analytics';
import { getLinkCreationAnalyticsEvent } from '../analytics';
import { findFilepaths, isLinkInMatches } from '../utils';
export function createKeymapPlugin() {
  var skipAnalytics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.addLink.common, showLinkToolbar(INPUT_METHOD.SHORTCUT), list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, mayConvertLastWordToHyperlink(skipAnalytics), list);
  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, mayConvertLastWordToHyperlink(skipAnalytics), list);
  keymaps.bindKeymapWithCommand(keymaps.escape.common, function (state, dispatch, view) {
    var hyperlinkPlugin = stateKey.getState(state);

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

var mayConvertLastWordToHyperlink = function mayConvertLastWordToHyperlink(skipAnalytics) {
  return function (state, dispatch) {
    var nodeBefore = state.selection.$from.nodeBefore;

    if (!nodeBefore || !nodeBefore.isText || !nodeBefore.text) {
      return false;
    }

    var words = nodeBefore.text.split(' ');
    var lastWord = words[words.length - 1];
    var match = getLinkMatch(lastWord);

    if (match) {
      var hyperlinkedText = match.raw;
      var start = state.selection.$from.pos - hyperlinkedText.length;
      var end = state.selection.$from.pos;

      if (state.doc.rangeHasMark(start, end, state.schema.marks.link)) {
        return false;
      }

      var url = match.url;
      var markType = state.schema.mark('link', {
        href: url
      });
      var filepaths = findFilepaths(nodeBefore.text, start - (nodeBefore.text.length - hyperlinkedText.length) // The position referenced by 'start' is relative to the start of the document, findFilepaths deals with index in a node only.
      );

      if (isLinkInMatches(start, filepaths)) {
        return false;
      }

      var tr = state.tr.addMark(start, end, markType);

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