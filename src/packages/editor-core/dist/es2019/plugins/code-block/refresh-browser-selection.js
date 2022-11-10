import { browser } from '@atlaskit/editor-common/utils';
import { pluginKey } from './plugin-key'; // Workaround for a firefox issue where dom selection is off sync
// https://product-fabric.atlassian.net/browse/ED-12442

const refreshBrowserSelection = () => {
  const domSelection = window.getSelection();

  if (domSelection) {
    const domRange = domSelection && domSelection.rangeCount === 1 && domSelection.getRangeAt(0).cloneRange();

    if (domRange) {
      domSelection.removeAllRanges();
      domSelection.addRange(domRange);
    }
  }
};

const refreshBrowserSelectionOnChange = (transaction, editorState) => {
  var _pluginKey$getState;

  if (browser.gecko && transaction.docChanged && // codeblockState.pos should be set if current selection is in a codeblock.
  typeof ((_pluginKey$getState = pluginKey.getState(editorState)) === null || _pluginKey$getState === void 0 ? void 0 : _pluginKey$getState.pos) === 'number') {
    refreshBrowserSelection();
  }
};

export default refreshBrowserSelectionOnChange;