import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { fakeCursorForToolbarPluginKey } from './fake-curor-for-toolbar-plugin-key';
import { InsertStatus, stateKey as hyperlinkStateKey } from './main';

var createTextCursor = function createTextCursor(pos) {
  var node = document.createElement('div');
  node.className = 'ProseMirror-fake-text-cursor';
  return Decoration.widget(pos, node, {
    key: 'hyperlink-text-cursor'
  });
};

var createTextSelection = function createTextSelection(from, to) {
  return Decoration.inline(from, to, {
    class: 'ProseMirror-fake-text-selection'
  });
};

var getInsertLinkToolbarState = function getInsertLinkToolbarState(editorState) {
  var state = hyperlinkStateKey.getState(editorState);

  if (state && state.activeLinkMark) {
    if (state.activeLinkMark.type === InsertStatus.INSERT_LINK_TOOLBAR) {
      return state.activeLinkMark;
    }
  }

  return undefined;
};

var fakeCursorToolbarPlugin = new SafePlugin({
  key: fakeCursorForToolbarPluginKey,
  state: {
    init: function init() {
      return DecorationSet.empty;
    },
    apply: function apply(tr, pluginState, oldState, newState) {
      var oldInsertToolbarState = getInsertLinkToolbarState(oldState);
      var insertToolbarState = getInsertLinkToolbarState(newState); // Map DecorationSet if it still refers to the same position in the document

      if (oldInsertToolbarState && insertToolbarState) {
        var from = insertToolbarState.from,
            to = insertToolbarState.to;
        var oldFrom = tr.mapping.map(oldInsertToolbarState.from);
        var oldTo = tr.mapping.map(oldInsertToolbarState.to);

        if (oldFrom === from && oldTo === to) {
          return pluginState.map(tr.mapping, tr.doc);
        }
      } // Update DecorationSet if new insert toolbar, or if we have moved to a different position in the doc


      if (insertToolbarState) {
        var _from = insertToolbarState.from,
            _to = insertToolbarState.to;
        return DecorationSet.create(tr.doc, [_from === _to ? createTextCursor(_from) : createTextSelection(_from, _to)]);
      }

      return DecorationSet.empty;
    }
  },
  props: {
    decorations: function decorations(state) {
      return fakeCursorForToolbarPluginKey.getState(state);
    }
  }
});
export default fakeCursorToolbarPlugin;