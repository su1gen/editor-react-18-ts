import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { isNodeSelection } from 'prosemirror-utils';

function isDivHTMLElement(elm) {
  return elm.tagName.toLowerCase() === 'div';
}

export var fixChromeSelectionKey = new PluginKey('fixChromeSelectionPlugin');
export default (function () {
  return new SafePlugin({
    key: fixChromeSelectionKey,
    props: {
      handleDOMEvents: {
        focus: function focus(view) {
          // We don't need to reset when there's a NodeSelection
          // It creates other problem. @see HOT-94478
          if (isDivHTMLElement(view.dom) && !isNodeSelection(view.state.selection)) {
            view.dom.style.display = 'inline-block';
            view.dom.offsetHeight;
            view.dom.style.display = 'block';
          }

          return false;
        }
      }
    }
  });
});