import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import { contentInSelection } from './content-in-selection';
export var selectionPluginKey = new PluginKey('mobile-selection');
export var createProseMirrorPlugin = function createProseMirrorPlugin(dispatch) {
  return new SafePlugin({
    view: function view(editorView) {
      var domAtPos = editorView.domAtPos.bind(editorView);
      return {
        update: function update(view, previousState) {
          var state = view.state,
              _view$state = view.state,
              selection = _view$state.selection,
              doc = _view$state.doc;

          if (previousState.doc.eq(doc) && previousState.selection.eq(selection)) {
            return;
          }

          var ref = findDomRefAtPos(selection.$anchor.pos, domAtPos);

          var _ref$getBoundingClien = ref.getBoundingClientRect(),
              top = _ref$getBoundingClien.top,
              left = _ref$getBoundingClien.left;

          var _contentInSelection = contentInSelection(state),
              nodeTypes = _contentInSelection.nodeTypes,
              markTypes = _contentInSelection.markTypes;

          dispatch(selectionPluginKey, {
            rect: {
              top: Math.round(top),
              left: Math.round(left)
            },
            selection: state.selection.toJSON(),
            nodeTypes: nodeTypes,
            markTypes: markTypes
          });
        }
      };
    }
  });
};
export var mobileSelectionPlugin = function mobileSelectionPlugin() {
  return {
    name: 'mobileSelection',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'mobileSelection',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createProseMirrorPlugin(dispatch);
        }
      }];
    }
  };
};